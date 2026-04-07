import React from 'react';

type Props = {
  pageUrl: string;
  height?: number;
  tabs?: 'timeline' | 'timeline,events' | 'timeline,messages' | 'timeline,events,messages';
};

export default function FacebookPagePlugin({ pageUrl, height = 560, tabs = 'timeline' }: Props) {
  const src = new URL('https://www.facebook.com/plugins/page.php');
  src.searchParams.set('href', pageUrl);
  src.searchParams.set('tabs', tabs);
  src.searchParams.set('width', '500');
  src.searchParams.set('height', String(height));
  src.searchParams.set('small_header', 'false');
  src.searchParams.set('adapt_container_width', 'true');
  src.searchParams.set('hide_cover', 'false');
  src.searchParams.set('show_facepile', 'true');

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
      <iframe
        title="Facebook Page"
        src={src.toString()}
        width="100%"
        height={height}
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
        frameBorder={0}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

