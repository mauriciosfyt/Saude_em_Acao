// src/components/insta/InstagramEmbed.jsx (ou ajuste conforme o seu caminho)
import { useEffect } from 'react';

const InstagramEmbed = ({ url }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };
  }, []);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ width: '100%', margin: '1rem 0' }}
    ></blockquote>
  );
};

export default InstagramEmbed;
