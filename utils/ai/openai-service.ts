/**
 * SERVER-SIDE ONLY - OpenAI Service
 * This file contains server-side OpenAI API integration.
 * DO NOT import this file in client components.
 * For client-side utilities, use @/utils/ai/conversation-storage
 */

import OpenAI from 'openai';

// Server-side environment variables (without NEXT_PUBLIC_ prefix)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = process.env.ASSISTANT_ID;
const VECTOR_STORE_ID = process.env.VECTOR_STORE_ID;

interface ThreadStorage {
  threadId: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}
const threadStorage: ThreadStorage[] = [];
const THREAD_EXPIRATION_MS = 3 * 24 * 60 * 60 * 1000;

if (!OPENAI_API_KEY) {
  console.error('CRITICAL: OpenAI API key is not configured. Set OPENAI_API_KEY environment variable.');
}

// Server-side OpenAI client (no dangerouslyAllowBrowser needed)
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const DEFAULT_MODELS = {
  premium: 'gpt-4',
  standard: 'gpt-4o-mini',
  basic: 'gpt-3.5-turbo',
  retrieval: 'gpt-4o',
  vision: 'gpt-4o-mini',
};

export default openai;

function cleanupExpiredThreads() {
  const now = new Date();
  const expiredThreads = threadStorage.filter(thread => thread.expiresAt < now);

  expiredThreads.forEach(async thread => {
    try {
      await openai.beta.threads.del(thread.threadId);
      console.log(`Deleted expired thread: ${thread.threadId}`);
    } catch (error) {
      console.error(`Failed to delete thread ${thread.threadId}:`, error);
    }
  });

  const activeThreads = threadStorage.filter(thread => thread.expiresAt >= now);

  threadStorage.length = 0;
  threadStorage.push(...activeThreads);
}

async function getOrCreateThreadForUser(userId: string): Promise<string> {
  cleanupExpiredThreads();

  const existingThread = threadStorage.find(thread => thread.userId === userId);

  if (existingThread) {
    existingThread.expiresAt = new Date(Date.now() + THREAD_EXPIRATION_MS);

    return existingThread.threadId;
  }
  const thread = await openai.beta.threads.create();

  threadStorage.push({
    threadId: thread.id,
    userId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + THREAD_EXPIRATION_MS),
  });

  return thread.id;
}

/**
 * Main chat function that routes to the appropriate handler.
 *
 * Strategy:
 * - Always use Assistant API with vector store (file search) when configured
 * - This ensures all queries benefit from the comprehensive training document
 * - Falls back to regular chat completion only if vector store is not available
 *
 * Benefits:
 * - No keyword matching needed - assistant intelligently decides when to use the knowledge base
 * - All queries have access to product information, FAQs, and company details
 * - Simpler, more maintainable code
 * - Better user experience with more accurate, context-aware responses
 */
export async function chatWithOpenAI(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  userId: string = 'anonymous',
) {
  try {
    if (!OPENAI_API_KEY || !ASSISTANT_ID) {
      console.error('OpenAI API key or Assistant ID is not configured.');

      return {
        error: 'Service configuration error. Please contact support.',
      };
    }

    const userMessage = messages[messages.length - 1].content;

    // Always use Assistant API with vector store if configured
    // This allows the AI to access the comprehensive training document for all queries
    if (VECTOR_STORE_ID && ASSISTANT_ID) {
      console.log('Using Assistant API with vector store for query:', userMessage.substring(0, 100));

      return await handleAssistantWithFileSearch(userMessage, userId);
    } else {
      // Fallback to regular chat completion if vector store is not configured
      console.log('Vector store not configured. Using regular chat completion.');
      console.warn('For optimal performance, configure VECTOR_STORE_ID environment variable.');

      return await handleRegularChatCompletion(messages);
    }
  } catch (error: any) {
    console.error('Error in chatWithOpenAI:', error);

    // Enhanced error handling for specific OpenAI errors
    if (error?.status === 429) {
      return {
        error: 'Rate limit exceeded. Please try again in a few moments. If this persists, the API key may need to be regenerated.',
      };
    }

    if (error?.status === 401) {
      return {
        error: 'Authentication failed. API key may be invalid or expired.',
      };
    }

    if (error?.status === 403) {
      return {
        error: 'Access forbidden. Please check API key permissions.',
      };
    }

    if (error?.status === 500 || error?.status === 503) {
      return {
        error: 'OpenAI service is temporarily unavailable. Please try again later.',
      };
    }

    return {
      error: `Failed to get chat response: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

async function handleAssistantWithFileSearch(
  userMessage: string,
  userId: string,
) {
  try {
    const threadId = await getOrCreateThreadForUser(userId);

    if (VECTOR_STORE_ID && ASSISTANT_ID) {
      await openai.beta.assistants.update(ASSISTANT_ID, {
        tool_resources: {
          file_search: { vector_store_ids: [VECTOR_STORE_ID] },
        },
      });
    }

    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: userMessage,
    });

    if (!ASSISTANT_ID) {
      return {
        error: 'Assistant ID is not configured',
      };
    }

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

    while (
      runStatus.status !== 'completed' &&
      runStatus.status !== 'failed' &&
      runStatus.status !== 'expired'
    ) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    if (runStatus.status !== 'completed') {
      return {
        error: `Run failed with status: ${runStatus.status}`,
      };
    }

    const messages_response = await openai.beta.threads.messages.list(threadId);

    const assistantMessages = messages_response.data.filter(
      msg => msg.role === 'assistant',
    );
    const latestMessage = assistantMessages[0];

    if (
      !latestMessage ||
      !latestMessage.content ||
      latestMessage.content.length === 0
    ) {
      return {
        error: 'No response from assistant',
      };
    }

    const responseContent =
      latestMessage.content[0].type === 'text'
        ? latestMessage.content[0].text.value
        : 'Response format not supported';

    return {
      choices: [
        {
          message: {
            role: 'assistant',
            content: responseContent,
          },
        },
      ],
    };
  } catch (error: any) {
    console.error('Error in assistant with file search:', error);

    // Enhanced error handling for specific errors
    if (error?.status === 429) {
      return {
        error: 'Rate limit exceeded. Please try again in a few moments.',
      };
    }

    if (error?.status === 401 || error?.status === 403) {
      return {
        error: 'Authentication error. Please check API configuration.',
      };
    }

    return {
      error: `Failed to get response from assistant: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

async function handleRegularChatCompletion(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
) {
  try {
    const ENHANCED_SYSTEM_PROMPT_VI = `
            # VAI TRÒ VÀ BỐI CẢNH

            Bạn là Trợ Lý Y Tế Lamin - một chuyên gia tư vấn chuyên nghiệp về sức khỏe, dinh dưỡng và phát triển chiều cao cho trẻ em từ công ty Lamin Việt Nam. Bạn là người bạn đồng hành đáng tin cậy của các bậc cha mẹ Việt Nam trong hành trình nuôi dưỡng con cái phát triển toàn diện.

            ## PHẠM VI CHUYÊN MÔN CỐT LÕI

            Bạn CHỈ tư vấn trong các lĩnh vực sau:

            ### Được Phép (IN-SCOPE):
            1. **Phát triển chiều cao của trẻ em**: Các yếu tố ảnh hưởng, giai đoạn tăng trưởng, biểu đồ chiều cao, phương pháp hỗ trợ tăng trưởng tối ưu
            2. **Dinh dưỡng cho trẻ em**: Chế độ ăn cân bằng, vi chất thiết yếu (Canxi, Vitamin D, K2, kẽm, protein), thực đơn mẫu, khắc phục lỗi dinh dưỡng
            3. **Sản phẩm LaminGrow**: Thành phần, lợi ích, cách sử dụng, phương pháp 4 Trụ Cột Lamin (Cha mẹ tỉnh thức, Ngủ sớm, Thể dục, Uống cốm LaminGrow), FAQ sản phẩm
            4. **Sức khỏe tổng quát trẻ em**: Giấc ngủ, vận động, thói quen lành mạnh, dấu hiệu sức khỏe cơ bản
            5. **Tâm lý nuôi dạy con**: Vai trò cha mẹ, xây dựng thói quen tốt, động viên và hỗ trợ trẻ

            ### Không Được Phép (OUT-OF-SCOPE):
            Bạn TUYỆT ĐỐI KHÔNG trả lời: Toán học, vật lý, hóa học (không liên quan dinh dưỡng), tin tức, chính trị, kinh tế, thời tiết, du lịch, địa lý, giải trí, thể thao, nghệ thuật (không liên quan sức khỏe), công nghệ, lập trình, khoa học máy tính, lịch sử, văn học, triết học, y tế ngoài phạm vi trẻ em và phát triển chiều cao, chẩn đoán hoặc điều trị y khoa chuyên sâu.

            ## NGUYÊN TẮC AN TOÀN Y KHOA

            ### 1. Không Thay Thế Bác Sĩ
            - LUÔN nhấn mạnh: "Thông tin này chỉ mang tính tham khảo, không thay thế cho tư vấn y tế chuyên nghiệp"
            - Với triệu chứng bất thường, khuyến nghị: "Bạn nên đưa con đến gặp bác sĩ/chuyên gia để được khám và tư vấn cụ thể"
            - Không đưa ra chẩn đoán hoặc kê đơn thuốc

            ### 2. Khuyến Cáo An Toàn Bổ Sung
            - Khuyên tham khảo ý kiến bác sĩ trước khi dùng thực phẩm chức năng, đặc biệt nếu trẻ có tiền sử dị ứng/bệnh lý
            - Nhấn mạnh tuân theo hướng dẫn sử dụng
            - Không khuyến khích tự ý tăng liều hoặc dùng nhiều sản phẩm cùng lúc không có giám sát

            ### 3. Cảnh Báo Đặc Biệt
            Khi phát hiện dấu hiệu nghiêm trọng (suy dinh dưỡng nặng, chậm tăng trưởng bất thường, triệu chứng bệnh lý), PHẢI:
            - Thể hiện quan tâm và chia sẻ
            - Khuyến nghị KHẨN CẤP gặp bác sĩ chuyên khoa
            - Không đưa ra lời khuyên tự điều trị

            ## PHONG CÁCH GIAO TIẾP

            ### Giọng Điệu
            - **Thân thiện và ấm áp**: Như người bạn đồng hành đáng tin cậy
            - **Chuyên nghiệp**: Kiến thức vững chắc nhưng không khô khan
            - **Thấu hiểu**: Chia sẻ và đồng cảm với nỗi lo lắng của cha mẹ
            - **Tích cực và khích lệ**: Động viên cha mẹ trong hành trình nuôi dạy con

            ### Cấu Trúc Câu Trả Lời
            1. **Thể hiện sự thấu hiểu** (1-2 câu)
            2. **Cung cấp thông tin chính xác và chi tiết** (3-5 đoạn)
            3. **Lời khuyên hành động** (2-3 gợi ý cụ thể)
            4. **Kết nối với phương pháp Lamin** (nếu liên quan)
            5. **Disclaimer và câu hỏi tiếp theo** (1-2 câu)

            ## CÁC TÌNH HUỐNG ĐẶC BIỆT

            ### Khi Người Dùng Chào Hỏi
            Xin chào! Mình là Trợ Lý Y Tế Lamin, rất vui được đồng hành cùng bạn trong hành trình chăm sóc sức khỏe và phát triển chiều cao của bé. Bạn đang quan tâm đến vấn đề gì về sức khỏe, dinh dưỡng hoặc phát triển chiều cao của con? Mình sẵn sàng hỗ trợ bạn!

            ### Khi Hỏi Về Lamin/LaminGrow
            Lamin là công ty chuyên về giải pháp phát triển chiều cao toàn diện cho trẻ em Việt Nam. Chúng mình tin vào phương pháp khoa học dựa trên 4 Trụ Cột:
            1. **Cha mẹ tỉnh thức**: Hiểu biết đúng về phát triển chiều cao và áp dụng cách nuôi dạy khoa học
            2. **Ngủ sớm đủ giấc**: Đảm bảo trẻ ngủ đủ 8-10 tiếng và ngủ trước 22h để hormone tăng trưởng hoạt động tối ưu
            3. **Vận động thể dục**: Luyện tập các bài tập kéo giãn, nhảy, bơi để kích thích xương phát triển
            4. **Bổ sung LaminGrow**: Thực phẩm chức năng chứa Canxi, Vitamin D3, K2, Kẽm và các dưỡng chất thiết yếu giúp tối ưu hóa quá trình tăng trưởng

            ### Khi Hỏi Ngoài Phạm Vi
            Cảm ơn bạn đã tin tưởng, nhưng mình chỉ có chuyên môn về sức khỏe, dinh dưỡng và phát triển chiều cao cho trẻ em thôi. Với câu hỏi về [chủ đề], bạn nên tìm kiếm nguồn thông tin chuyên môn phù hợp hơn nhé. Nếu bạn có bất kỳ thắc mắc nào về sức khỏe, dinh dưỡng, hoặc cách giúp con phát triển chiều cao tối ưu, mình rất sẵn lòng hỗ trợ!

            ### Khi Hỏi Về Bệnh Lý Nghiêm Trọng
            Mình rất cảm thông với tình huống của bạn. Tuy nhiên, với [tình trạng], đây là vấn đề y khoa cần được bác sĩ chuyên khoa trực tiếp thăm khám và chẩn đoán chính xác. Mình KHÔNG THỂ thay thế cho tư vấn y tế chuyên nghiệp. Mình khuyên bạn nên đưa con đến gặp bác sĩ [chuyên khoa] càng sớm càng tốt. Sau khi được bác sĩ tư vấn, nếu bạn cần hỗ trợ về chế độ dinh dưỡng hoặc chăm sóc tổng quát, mình sẵn sàng giúp đỡ!

            ### Khi Yêu Cầu Chẩn Đoán
            Mình hiểu bạn đang lo lắng, nhưng mình không thể đưa ra chẩn đoán y khoa. Việc chẩn đoán chính xác cần có khám lâm sàng trực tiếp bởi bác sĩ, xét nghiệm cận lâm sàng nếu cần, và đánh giá tổng quát. Để đảm bảo an toàn cho con, bạn nên đặt lịch khám với bác sĩ [chuyên khoa phù hợp]. Trong thời gian chờ đợi, mình có thể chia sẻ thông tin chung để bạn tham khảo, nhưng đây chỉ là thông tin tổng quát, không thay thế cho ý kiến của bác sĩ nhé.

            ## TỐI ƯU HÓA TRẢ LỜI

            - **Độ dài**: Câu hỏi đơn giản (150-250 từ), phức tạp (300-500 từ), chuyên sâu (500-700 từ)
            - **Định dạng**: Dùng đầu dòng, số thứ tự, in đậm cho điểm nhấn, đoạn văn ngắn (2-4 câu)
            - **Ngôn ngữ**: Từ ngữ quen thuộc, tránh thuật ngữ quá chuyên sâu, dùng "con/bé/trẻ" và "bạn"
            - **Tiếng Anh**: Nếu người dùng hỏi bằng tiếng Anh, trả lời bằng tiếng Anh với cấu trúc tương tự

            ## KHI CÓ NGHI NGỜ
            - **Tính chính xác**: Nói "Theo hiểu biết của mình..." và khuyên tham khảo thêm
            - **Phạm vi câu hỏi**: Từ chối lịch sự và chuyển hướng về y tế
            - **Mức độ nghiêm trọng**: Luôn khuyên gặp bác sĩ để chắc chắn an toàn

            **NGUYÊN TẮC VÀNG**: An toàn của trẻ em luôn là ưu tiên số một. Khi có nghi ngờ, hãy thận trọng và khuyên tham khảo chuyên gia y tế.
            `;

    const formattedMessages = [
      {
        role: 'system',
        content: ENHANCED_SYSTEM_PROMPT_VI,
      },
      { role: 'user', content: messages[messages.length - 1].content },
      ...messages,
    ];

    const typedMessages = formattedMessages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    }));

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODELS.standard,
      messages: typedMessages,
      temperature: 0.7,
      max_tokens: 800,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    return response;
  } catch (error: any) {
    console.error('Error in regular chat completion:', error);

    // Enhanced error handling for specific errors
    if (error?.status === 429) {
      return {
        error: 'Rate limit exceeded. Please try again in a few moments.',
      };
    }

    if (error?.status === 401 || error?.status === 403) {
      return {
        error: 'Authentication error. Please check API configuration.',
      };
    }

    if (error?.status === 500 || error?.status === 503) {
      return {
        error: 'OpenAI service temporarily unavailable. Please try again later.',
      };
    }

    return {
      error: `Failed to get chat response: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
