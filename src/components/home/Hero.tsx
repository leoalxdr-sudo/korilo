import { HomeExperience } from "@/components/home/HomeExperience";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { runKoriloSearch } from "@/lib/ai";
import { getRandomProducts } from "@/lib/data";

export async function Hero() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const preview = runKoriloSearch(
    { query: dict.productPreview.previewQuery },
    locale
  );
  const trending = getRandomProducts(16);

  return (
    <HomeExperience
      locale={locale}
      previewCriteria={preview.criteria}
      previewRecommendations={preview.recommendations}
      trendingProducts={trending}
    />
  );
}
