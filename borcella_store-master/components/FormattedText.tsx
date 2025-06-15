interface FormattedTextProps {
  text: string;
  className?: string;
}

const FormattedText = ({ text, className = "" }: FormattedTextProps) => {
  // First split by newlines to handle line breaks
  const lines = text.split('\n');
  
  return (
    <div className={className}>
      {lines.map((line, lineIndex) => {
        // Then split each line by ** to handle bold text
        const parts = line.split(/(\*\*.*?\*\*)/g);
        
        return (
          <div key={lineIndex} className="mb-2">
            {parts.map((part, partIndex) => {
              // If part is wrapped in **, make it bold
              if (part.startsWith('**') && part.endsWith('**')) {
                const boldText = part.slice(2, -2);
                return <strong key={partIndex}>{boldText}</strong>;
              }
              // Otherwise return as normal text
              return <span key={partIndex}>{part}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default FormattedText; 