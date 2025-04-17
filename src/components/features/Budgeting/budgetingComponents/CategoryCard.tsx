import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";
import { deleteCategoryForUser } from "../../../../services/categoryService";
import styles from "./CategoryCard.module.css";

interface Category {
  categoryId: string;
  name: string;
  description?: string;
  type: "INCOME" | "EXPENSE";
}

interface CategoryCardProps {
  category: Category;
  total: number;
  currentDate: Date;
  onEditClick: (category: Category) => void;
  fetchCategories: () => Promise<void>;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  total,
  currentDate,
  onEditClick,
  fetchCategories,
}) => {
  const { t } = useTranslation("budgeting");
  const { user, getAccessTokenSilently } = useAuth0();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDeleteCategory = async () => {
    if (!user) return;
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cette catégorie ?");
    if (!confirmed) return;

    const token = await getAccessTokenSilently();
    if (!user.sub) throw new Error("User ID is undefined");

    await deleteCategoryForUser(user.sub, category.categoryId, token);
    await fetchCategories();
  };

  return (
    <div className={styles.categoryCard}>
      <div className={styles.cardContent}>
        <Link
          to={`/category/${encodeURIComponent(category.name)}`}
          state={{
            categoryName: category.name,
            categoryId: category.categoryId,
            categoryType: category.type,
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1,
          }}
        >
          <h4 className={styles.categoryName}>{category.name}</h4>
          <p className={styles.categoryTotal}>
            {t("categories.total")}: ${total || 0}
          </p>
        </Link>
      </div>

      <div className={styles.cardMenu}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className={styles.threeDotButton}
        >
          <FaEllipsisV />
        </button>
        {menuOpen && (
          <div className={styles.threeDotMenu}>
            <button
              className={styles.menuItem}
              onClick={() => {
                setMenuOpen(false);
                onEditClick(category);
              }}
            >
              Modifier
            </button>
            <button
              className={`${styles.menuItem} ${styles.deleteItem}`}
              onClick={() => {
                setMenuOpen(false);
                handleDeleteCategory();
              }}
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;