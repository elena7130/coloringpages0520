// components/TagSelector.tsx
interface TagSelectorProps {
    tags: string[];
    onSelectTag: (tag: string) => void;
  }
  
  const TagSelector = ({ tags, onSelectTag }: TagSelectorProps) => {
    return (
      <div className="tag-container">
        {tags.map((tag, index) => (
          <button key={index} onClick={() => onSelectTag(tag)} className="tag-button">
            #{tag}
          </button>
        ))}
      </div>
    );
  };
  
  export default TagSelector;
  