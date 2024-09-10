import React from 'react';

const EmojiBar = ({ onEmojiClick }) => {
    const emojis = ['❤️', '😂', '😮', '😢', '😡', '👍']; // Thêm các emoji bạn muốn

    return (
        <div className="emoji-bar">
            {emojis.map((emoji, index) => (
                <span key={index} onClick={() => onEmojiClick(emoji)} className="emoji">
          {emoji}
        </span>
            ))}
        </div>
    );
};

export default EmojiBar;
