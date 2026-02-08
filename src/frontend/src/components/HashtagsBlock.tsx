import { HASHTAGS } from '../config/hashtags';

/**
 * Reusable component that displays hashtags as styled pills/chips
 * Renders all hashtags from the centralized config
 */
export default function HashtagsBlock() {
  return (
    <section className="py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Hashtags
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {HASHTAGS.map((hashtag, index) => (
              <span
                key={index}
                className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm md:text-base font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                {hashtag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
