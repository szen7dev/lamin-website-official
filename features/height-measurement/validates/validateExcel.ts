/**
 * @param data
 * @returns Mảng các thông báo lỗi
 */
export const validateExcelData = (data: any[]): string[] => {
  const errors: string[] = [];

  // 1. Kiểm tra mảng dữ liệu có đủ phần tử không
  if (!data || data.length < 2) {
    errors.push(
      'File Excel không đủ dữ liệu. Cần có ít nhất header và một dòng dữ liệu.',
    );

    return errors;
  }

  // 2. Kiểm tra header có chứa các trường cần thiết không
  const headerRow = data[0]; // Phần tử đầu tiên là header

  // Kiểm tra các cột cần thiết
  if (!headerRow.EMPTY || headerRow.EMPTY !== 'Tên bé') {
    errors.push('Thiếu cột "Tên bé" trong file Excel.');
  }

  if (!headerRow.EMPTY_1 || headerRow.EMPTY_1 !== 'Giới tính') {
    errors.push('Thiếu cột "Giới tính" trong file Excel.');
  }

  if (!headerRow.EMPTY_2 || headerRow.EMPTY_2 !== 'Ngày sinh') {
    errors.push('Thiếu cột "Ngày sinh" trong file Excel.');
  }

  if (!headerRow.EMPTY_3 || headerRow.EMPTY_3 !== 'Chiều cao (cm)') {
    errors.push('Thiếu cột "Chiều cao (cm)" trong file Excel.');
  }

  if (!headerRow.EMPTY_4 || headerRow.EMPTY_4 !== 'Cân nặng (kg)') {
    errors.push('Thiếu cột "Cân nặng (kg)" trong file Excel.');
  }

  if (errors.length > 0) {
    return errors;
  }

  // 3. Kiểm tra từng dòng dữ liệu (bắt đầu từ phần tử thứ 2 trở đi)
  for (let i = 1; i < data.length; i++) {
    const rowIndex = i + 1; // Số thứ tự dòng trong Excel (bắt đầu từ 1)
    const row = data[i];

    // 3.1 Kiểm tra Tên bé
    if (
      !row.EMPTY ||
      typeof row.EMPTY !== 'string' ||
      row.EMPTY.trim() === ''
    ) {
      errors.push(`Dòng ${rowIndex}: Tên bé không được để trống.`);
    }

    // 3.2 Kiểm tra Giới tính
    if (!row.EMPTY_1) {
      errors.push(`Dòng ${rowIndex}: Giới tính không được để trống.`);
    } else if (!['Nam', 'Nữ'].includes(row.EMPTY_1)) {
      errors.push(`Dòng ${rowIndex}: Giới tính phải là "Nam" hoặc "Nữ".`);
    }

    // 3.3 Kiểm tra Ngày sinh
    if (row.EMPTY_2 === undefined || row.EMPTY_2 === null) {
      errors.push(`Dòng ${rowIndex}: Ngày sinh không được để trống.`);
    }
    // Coi ngày sinh là hợp lệ nếu là số (Excel date) hoặc string

    // 3.4 Kiểm tra Chiều cao
    if (row.EMPTY_3 === null || row.EMPTY_3 === undefined) {
      errors.push(`Dòng ${rowIndex}: Chiều cao không được để trống.`);
    } else if (isNaN(Number(row.EMPTY_3))) {
      errors.push(`Dòng ${rowIndex}: Chiều cao phải là số.`);
    } else if (Number(row.EMPTY_3) <= 0 || Number(row.EMPTY_3) > 250) {
      errors.push(
        `Dòng ${rowIndex}: Chiều cao phải nằm trong khoảng 1-250 cm.`,
      );
    }

    // 3.5 Kiểm tra Cân nặng
    if (row.EMPTY_4 === null || row.EMPTY_4 === undefined) {
      errors.push(`Dòng ${rowIndex}: Cân nặng không được để trống.`);
    } else if (isNaN(Number(row.EMPTY_4))) {
      errors.push(`Dòng ${rowIndex}: Cân nặng phải là số.`);
    } else if (Number(row.EMPTY_4) <= 0 || Number(row.EMPTY_4) > 200) {
      errors.push(`Dòng ${rowIndex}: Cân nặng phải nằm trong khoảng 1-200 kg.`);
    }

    // 3.6 Kiểm tra Convert Gender (nếu có)
    if (row.EMPTY_5 !== undefined && row.EMPTY_5 !== null) {
      const genderValue = Number(row.EMPTY_5);

      if (isNaN(genderValue) || ![1, 2, 3].includes(genderValue)) {
        errors.push(`Dòng ${rowIndex}: Convert Gender phải là 1, 2 hoặc 3.`);
      }
    }

    // 3.7 Kiểm tra Convert Birthday (nếu có)
    if (row.EMPTY_6 && typeof row.EMPTY_6 === 'string') {
      // Kiểm tra định dạng ngày YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{1,2}-\d{1,2}$/;

      if (!dateRegex.test(row.EMPTY_6)) {
        errors.push(
          `Dòng ${rowIndex}: Convert Birthday phải có định dạng YYYY-MM-DD.`,
        );
      }
    }
  }

  return errors;
};
