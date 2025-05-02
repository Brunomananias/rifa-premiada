// utils/index.ts

export const formatWhatsapp = (value: string): string => {
    let onlyNumbers = value.replace(/\D/g, '');
  
    if (onlyNumbers.length > 11) onlyNumbers = onlyNumbers.slice(0, 11);
  
    onlyNumbers = onlyNumbers.replace(/^(\d{2})(\d)/g, '($1) $2');
    onlyNumbers = onlyNumbers.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  
    return onlyNumbers;
  };
  