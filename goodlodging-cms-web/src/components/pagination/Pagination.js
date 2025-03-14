import React from 'react';
import "./style.scss";

function Pagination({ posts, onPageChange }) {
    const renderPagination = () => {
        const { totalPages, number } = posts;
        const maxButtons = 5;
        const pages = [];
        const half = Math.floor(maxButtons / 2);

        let startPage = Math.max(0, number - half);
        let endPage = Math.min(totalPages - 1, startPage + maxButtons - 1);

        if (endPage - startPage + 1 < maxButtons) {
            startPage = Math.max(0, endPage - maxButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <li key={i}>
                    <button
                        className={i === number ? 'active' : ''}
                        onClick={() => onPageChange(i)}
                    >
                        {i + 1}
                    </button>
                </li>
            );
        }

        if (startPage > 0) {
            pages.unshift(<li key="start-ellipsis">...</li>);
            pages.unshift(
                <li key="start">
                    <button onClick={() => onPageChange(0)}>1</button>
                </li>
            );
        }
        if (endPage < totalPages - 1) {
            pages.push(<li key="end-ellipsis">...</li>);
            pages.push(
                <li key="end">
                    <button onClick={() => onPageChange(totalPages - 1)}>
                        {totalPages}
                    </button>
                </li>
            );
        }

        return pages;
    };

    return (
        <ul className="pagination">
            <li>
                <button
                    disabled={posts.first}
                    onClick={() => onPageChange(0)}
                >
                    Trang đầu
                </button>
            </li>
            <li>
                <button
                    disabled={posts.first}
                    onClick={() => onPageChange(posts.number - 1)}
                >
                    {"<"}
                </button>
            </li>
            {renderPagination()}
            <li>
                <button
                    disabled={posts.last}
                    onClick={() => onPageChange(posts.number + 1)}
                >
                    {">"}
                </button>
            </li>
            <li>
                <button
                    disabled={posts.last}
                    onClick={() => onPageChange(posts.totalPages - 1)}
                >
                    Trang cuối
                </button>
            </li>
        </ul>
    );
}

export default Pagination;