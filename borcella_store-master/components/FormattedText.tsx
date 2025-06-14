interface FormattedTextProps {
  text: string;
  className?: string;
}

const FormattedText = ({ text, className = "" }: FormattedTextProps) => {
  // Split text by ** and map through parts
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return (
    <div className={className}>
      {parts.map((part, index) => {
        // If part is wrapped in **, make it bold
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          return <strong key={index}>{boldText}</strong>;
        }
        // Otherwise return as normal text
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};

export default FormattedText; 