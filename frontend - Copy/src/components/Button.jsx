import React from "react";

class Button extends React.Component {
    render() {
        const { className, children, onClick, type, disabled } = this.props;
        return (
            <button
                className={`px-4 py-2 bg-black text-white rounded-lg transition hover:bg-gray-700 ${className}`}
                onClick={onClick}
                type={type}
                disabled={disabled}
            >
                {children}
            </button>
        );
    }
}

class EditButton extends React.Component {
    render() {
        const { className, children, onClick, type } = this.props;
        return (
            <button
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition hover:bg-blue-700 ${className}`}
                onClick={onClick}
                type={type}
            >
                {children}
            </button>
        );
    }
}

class DeleteButton extends React.Component {
    render() {
        const { className, children, onClick, type } = this.props;
        return (
            <button
                className={`px-4 py-2 bg-red-600 text-white rounded-lg transition hover:bg-red-700 ${className}`}
                onClick={onClick}
                type={type}
            >
                {children}
            </button>
        );
    }
}

export {Button,EditButton, DeleteButton};