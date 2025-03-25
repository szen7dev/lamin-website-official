import type { Metadata } from 'next';

import ArticleList from '@/features/article/components/ArticleList';
import CategoryList from '@/features/article/components/CategoryList';
import PopularArticles from '@/features/article/components/PopularArticles';
import { articleService } from '@/features/article/services/articleServiceFactory';
import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  let seoData = {
    title: 'Danh Mục Bài Viết - Góc Sức Khỏe',
    description:
      'Các bài viết theo danh mục về sức khỏe và dinh dưỡng từ Lamin Pharmacy',
  };

  try {
    const categories = await articleService.getArticleCategories();
    const category = categories.find(cat => cat.slug === params.slug);

    if (category) {
      seoData = {
        title: category.name,
        description:
          category.description ||
          `Những bài viết về ${category.name} từ Lamin Pharmacy`,
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return generateSeoMetadata(seoData);
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const categorySlug = params.slug;

  // Fetch data on the server
  const categories = await articleService.getArticleCategories();
  const currentCategory = categories.find(cat => cat.slug === categorySlug);
  const articles = await articleService.getArticles({
    categorySlug,
    page: 1,
    limit: 12,
  });
  const popularArticles = await articleService.getPopularArticles(5);

  return (
    <div className="min-h-screen bg-background pb-12 pt-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <DynamicBreadcrumb />

        {/* Title Section */}
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-grayscale-90">
            {currentCategory?.name}
          </h1>
          {currentCategory?.description && (
            <p className="text-grayscale-60">{currentCategory.description}</p>
          )}
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Main Content */}
          <main className="md:col-span-8">
            {/* Categories */}
            <section aria-labelledby="categories-heading" className="mb-8">
              <h2
                className="mb-4 text-xl font-bold text-grayscale-90"
                id="categories-heading">
                Danh Mục
              </h2>
              <CategoryList activeSlug={categorySlug} categories={categories} />
            </section>

            {/* Articles */}
            <section aria-labelledby="category-articles">
              <h2
                className="mb-4 text-xl font-bold text-grayscale-90"
                id="category-articles">
                Bài Viết Trong Danh Mục {currentCategory?.name}
              </h2>
              <ArticleList articles={articles.articles} />

              {articles.articles.length === 0 && (
                <p className="py-8 text-center text-grayscale-60">
                  Không có bài viết nào trong danh mục này.
                </p>
              )}
            </section>
          </main>

          {/* Sidebar */}
          <aside className="md:col-span-4">
            {/* Popular Articles */}
            <section
              aria-labelledby="popular-articles"
              className="mb-8 rounded-lg bg-white p-6 shadow-sm">
              <h2
                className="mb-4 text-xl font-bold text-grayscale-90"
                id="popular-articles">
                Bài Viết Phổ Biến
              </h2>
              <PopularArticles articles={popularArticles} />
            </section>

            {/* Newsletter Signup */}
            <section
              aria-labelledby="newsletter-signup"
              className="rounded-lg bg-primary-5 p-6 text-white">
              <h2 className="mb-2 text-xl font-bold" id="newsletter-signup">
                Đăng Ký Nhận Tin
              </h2>
              <p className="mb-4 text-white/80">
                Nhận thông tin sức khỏe mới nhất qua email
              </p>
              <form className="space-y-3">
                <label className="sr-only" htmlFor="email-signup">
                  Email của bạn
                </label>
                <input
                  className="w-full rounded-lg border-none px-4 py-2 text-grayscale-90"
                  id="email-signup"
                  placeholder="Email của bạn"
                  type="email"
                />
                <button
                  className="w-full rounded-lg bg-white px-4 py-2 font-medium text-primary-5 hover:bg-white/90"
                  type="submit">
                  Đăng Ký
                </button>
              </form>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
