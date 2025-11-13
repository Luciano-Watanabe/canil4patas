import React from 'react';

export const CogIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.226l.28-.1c.34-.124.704-.124 1.044 0l.28.1c.55.219 1.02.684 1.11 1.226l.092.548c.18.991.755 1.833 1.527 2.44l.38.303c.44.351.632.946.484 1.485l-.12.33a1.875 1.875 0 01-1.42 1.258l-.38.076c-.96.19-1.812.748-2.404 1.49l-.33.41c-.372.468-.973.71-1.59.56l-.4-.126a1.875 1.875 0 01-1.258-1.42l-.076-.38c-.19-.96-.748-1.812-1.49-2.404l-.41-.33c-.468-.372-.71-.973-.56-1.59l.126-.4c.158-.523.658-1.01 1.232-1.24l.38-.152c.991-.393 1.833-1.26 2.44-2.292l.548-.92z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
