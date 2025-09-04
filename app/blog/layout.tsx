import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '音乐创作博客 - Only 90s R&B',
  description: '探索音乐制作的奥秘，分享创作技巧，了解行业动态。深入探讨90年代R&B音乐的精髓，以及现代音乐制作的技术与艺术。',
  keywords: ['音乐制作', '90s R&B', '音乐创作', '制作技巧', '音乐理论', '录音技术'],
  openGraph: {
    title: '音乐创作博客 - Only 90s R&B',
    description: '探索音乐制作的奥秘，分享创作技巧，了解行业动态。',
    type: 'website',
    locale: 'zh_CN',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-layout">
      {children}
    </div>
  );
}
