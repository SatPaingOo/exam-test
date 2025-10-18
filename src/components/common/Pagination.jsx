import React from "react";
import PropTypes from "prop-types";
import { Button, Select } from "./index";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  className = "",
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        // In the middle
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page !== "..." && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalItems === 0) return null;

  return (
    <div className={`pagination ${className}`}>
      <div className="pagination__info">
        <span className="pagination__text">
          Showing {startItem} to {endItem} of {totalItems} entries
        </span>
        {showItemsPerPage && (
          <div className="pagination__per-page">
            <span className="pagination__text">Show:</span>
            <Select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              options={[
                { value: 10, label: "10" },
                { value: 25, label: "25" },
                { value: 50, label: "50" },
                { value: 100, label: "100" },
              ]}
              className="pagination__select"
            />
            <span className="pagination__text">per page</span>
          </div>
        )}
      </div>

      <div className="pagination__controls">
        <Button
          onClick={handlePrevClick}
          disabled={currentPage === 1}
          variant="secondary"
          size="small"
          className="pagination__btn"
        >
          Previous
        </Button>

        <div className="pagination__pages">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(page)}
              className={`pagination__page ${
                page === currentPage ? "pagination__page--active" : ""
              } ${page === "..." ? "pagination__page--ellipsis" : ""}`}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}
        </div>

        <Button
          onClick={handleNextClick}
          disabled={currentPage === totalPages}
          variant="secondary"
          size="small"
          className="pagination__btn"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onItemsPerPageChange: PropTypes.func.isRequired,
  showItemsPerPage: PropTypes.bool,
  className: PropTypes.string,
};

export default Pagination;
