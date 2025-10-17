import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/common";
import dummyData from "@/assets/data/dummy.json";

const Categories = () => {
  // Calculate exam counts for each category
  const categoriesWithCounts = useMemo(() => {
    return dummyData.categories.map((category) => {
      // Count exams in this category
      const examsCount = dummyData.exams.filter(
        (exam) => exam.categoryId === category.id
      ).length;

      return {
        ...category,
        examsCount,
        available: examsCount > 0,
      };
    });
  }, []);

  return (
    <div className="categories-page">
      <section className="page-hero">
        <div className="container">
          <p className="page-hero__eyebrow">Browse by Category</p>
          <h1 className="page-hero__title">Exam Categories</h1>
          <p className="page-hero__subtitle">
            Choose a category to explore related exams and certifications
          </p>
        </div>
      </section>

      <section className="categories-content">
        <div className="container">
          <div className="categories-grid">
            {categoriesWithCounts.map((category) => {
              const isAvailable = category.available && category.examsCount > 0;

              return (
                <div key={category.id} className="category-link-wrapper">
                  {isAvailable ? (
                    <Link
                      to={`/exams?category=${category.id}`}
                      className="category-link"
                    >
                      <Card className="category-card" hover={true}>
                        <div className="category-card__icon">
                          {category.icon}
                        </div>
                        <h3 className="category-card__title">
                          {category.name}
                        </h3>
                        <p className="category-card__description">
                          {category.description}
                        </p>
                        <div className="category-card__meta">
                          <span className="category-card__count">
                            {category.examsCount}{" "}
                            {category.examsCount === 1 ? "Exam" : "Exams"}
                          </span>
                        </div>
                      </Card>
                    </Link>
                  ) : (
                    <Card
                      className="category-card category-card--unavailable"
                      hover={false}
                    >
                      <div className="category-card__icon category-card__icon--unavailable">
                        {category.icon}
                      </div>
                      <h3 className="category-card__title">{category.name}</h3>
                      <p className="category-card__description">
                        {category.description}
                      </p>
                      <div className="category-card__meta">
                        <span className="category-card__unavailable">
                          Not Available
                        </span>
                      </div>
                    </Card>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;
