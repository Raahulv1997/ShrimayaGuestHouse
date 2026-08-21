import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const WhatsAppFloat = () => {
  const { t } = useLanguage();
  const phoneNumber = '918269364180';
  const message = 'Hello Shrimaya Guest House! I want to inquire about room availability.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label={t('floatingWhatsAppText')}
      title={t('floatingWhatsAppText')}
    >
      <svg
        viewBox="0 0 24 24"
        width="30"
        height="30"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.012 2C6.48 2 2 6.48 2 12.012c0 1.764.456 3.48 1.332 5.004L2 22l5.124-1.332c1.488.816 3.168 1.344 4.884 1.344C17.52 22 22 17.52 22 12.012 22 6.48 17.52 2 12.012 2zm.012 18.288c-1.572 0-3.12-.42-4.488-1.224l-.324-.192-3.324.864.888-3.24-.216-.348c-.876-1.404-1.344-3.036-1.344-4.716 0-4.86 3.96-8.82 8.82-8.82s8.82 3.96 8.82 8.82-3.96 8.82-8.82 8.82zm4.788-6.108c-.264-.132-1.56-.768-1.788-.864-.24-.084-.408-.132-.576.132-.168.264-.66.828-.804.996-.144.168-.288.192-.552.06-2.58-1.116-3.768-2.616-4.2-3.372-.264-.456.096-.408.432-.984.072-.12.036-.228-.012-.324-.048-.096-.408-.984-.564-1.356-.144-.36-.312-.312-.432-.312-.108-.012-.24-.012-.372-.012-.132 0-.348.048-.528.252-.18.204-.696.684-.696 1.668s.72 1.932.816 2.064c.096.132 1.416 2.16 3.432 3.036.48.204.852.324 1.14.42.48.156.924.132 1.272.084.384-.06.132-.24.756-.912.228-.24.372-.516.48-.756.108-.24.06-.456-.036-.588z" />
      </svg>
    </a>
  );
};

export default WhatsAppFloat;
