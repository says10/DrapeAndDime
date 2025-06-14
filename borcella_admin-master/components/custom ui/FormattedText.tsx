import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  const formatText = (text: string) => {
    // Split by ** markers and map to elements
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove ** markers and wrap in strong tag
        const boldText = part.slice(2, -2);
        return <strong key={index}>{boldText}</strong>;
      }
      // Preserve newlines
      return part.split('\n').map((line, lineIndex, array) => (
        <React.Fragment key={`${index}-${lineIndex}`}>
          {line}
          {lineIndex < array.length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  return (
    <div className={`whitespace-pre-wrap ${className}`}>
      {formatText(text)}
    </div>
  );
};

export default FormattedText; 