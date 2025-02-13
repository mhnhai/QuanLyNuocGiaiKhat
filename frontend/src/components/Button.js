import React from "react";

class Button extends React.Component {
    render() {
        const { className, children, onClick } = this.props;
        return (
            <button
                className={`mb-4 px-4 py-2 bg-black text-white rounded transition hover:bg-white hover:text-black hover:outline hover:outline-black ${className}`}
                onClick={onClick}
            >
                {children}
            </button>
        );
    }
}

export default Button;