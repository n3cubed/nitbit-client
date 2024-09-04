import styles from './CategoricalSymbol.module.css'

interface CategoricalSymbolProps {
  for: string,
  small?: boolean,
}

interface Category {
  color: string;
  symbol: string;
}

const Categories: Record<string, Category> = {
  Release: {
    color: '#ff5254',
    symbol: 'R',
  },
  Devlog: {
    color: '#db8ae6',
    symbol: 'D',
  },
  Notes: {
    color: '#dcdfda',
    symbol: 'N',
  },
};

const CategoricalSymbol: React.FC<CategoricalSymbolProps> = ({ for: category, small }) => {
  return (
    <div className={`${styles['categorical-symbol']} ${small ? styles.small : ''}`} style={{ backgroundColor: Categories[category].color }}>
      {small ? '' : Categories[category].symbol}
    </div>
  )

}

export default CategoricalSymbol;