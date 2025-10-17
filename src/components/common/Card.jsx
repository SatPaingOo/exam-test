import React from "react";
import PropTypes from "prop-types";

const Card = ({
  children,
  title,
  subtitle,
  footer,
  hover = true,
  className = "",
  ...props
}) => {
  const cardClass = `
    card 
    ${hover ? "card--hover" : ""}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <div className={cardClass} {...props}>
      {(title || subtitle) && (
        <div className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {subtitle && <p className="card__subtitle">{subtitle}</p>}
        </div>
      )}

      <div className="card__body">{children}</div>

      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  footer: PropTypes.node,
  hover: PropTypes.bool,
  className: PropTypes.string,
};

export default Card;
