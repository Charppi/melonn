import React from 'react'

export const Pagination: React.FC<{ total: number, onChangePage(index: number): void }> = ({ total, onChangePage }) => {

    const rango = Array.from(Array(Math.ceil(total / 10)).keys());

    return <nav>
        {rango.map((index) => {
            return <button
                className="btn btn-outline-primary mx-1"
                onClick={() => onChangePage(index)}
                key={index.toString()}>
                {index + 1}
            </button>

        })}
    </nav>
}
