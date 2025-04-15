import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CategoryCard from "./CategoryCard";
import CategoryModal from "../modals/CategoryModal";
import { updateCategoryForUser } from "../../../../services/categoryService";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "./CategorySection.module.css";

interface Category {
  categoryId: string;
  name: string;
  description?: string;
  type: "INCOME" | "EXPENSE";
}

interface CategorySectionProps {
  title: string;
  type: "INCOME" | "EXPENSE";
  pages: Category[][];
  pageIndex: number;
  prevPage: () => void;
  nextPage: () => void;
  setPageIndex: (index: number) => void;
  onAddClick: () => void;
  currentDate: Date;
  totalsMap: Record<string, number>;
  fetchCategories: () => Promise<void>;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  type,
  pages,
  pageIndex,
  prevPage,
  nextPage,
  setPageIndex,
  onAddClick,
  currentDate,
  totalsMap,
  fetchCategories,
}) => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditDesc(cat.description || "");
  };

  const closeEditModal = () => {
    setEditingCategory(null);
    setEditName("");
    setEditDesc("");
  };

  const handleSaveEdit = async () => {
    if (!editingCategory || !user) return;
    const token = await getAccessTokenSilently();
    if (!user.sub) return;

    await updateCategoryForUser(
      user.sub,
      editingCategory.categoryId,
      { name: editName, description: editDesc },
      token
    );
    closeEditModal();
    await fetchCategories();
  };

  return (
    <div>
      <h2 className={`${styles.categoryTitle} ${
        type === "INCOME" ? styles.incomeTitle : styles.expensesTitle
      }`}>
        {title}
      </h2>
      
      <div className={styles.carouselContainer}>
        <div className={styles.pageNavigationWrapper}>
          <button 
            onClick={prevPage} 
            className={`${styles.arrowButton} ${pageIndex === 0 ? styles.disabled : ''}`}
            disabled={pageIndex === 0}
          >
            <FaChevronLeft />
          </button>
          
          <div className={styles.carouselWrapper}>
            <div className={styles.carouselTrack} style={{
              transform: `translateX(-${pageIndex * 100}%)`
            }}>
              {pages.map((page, pageIdx) => (
                <div key={`${type}-page-${pageIdx}`} className={styles.carouselPage}>
                  {page.map((category) => (
                    <CategoryCard 
                      key={category.categoryId}
                      category={category}
                      total={totalsMap[category.categoryId] || 0}
                      currentDate={currentDate}
                      onEditClick={openEditModal}
                      fetchCategories={fetchCategories}
                    />
                  ))}
                  
                  {/* Ajout du bouton "+" uniquement à la dernière page */}
                  {pageIdx === pages.length - 1 && (
                    <button
                      onClick={onAddClick}
                      className={styles.addCategoryButton}
                    >
                      <span className={styles.addIcon}>+</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={nextPage} 
            className={`${styles.arrowButton} ${pageIndex >= pages.length - 1 ? styles.disabled : ''}`}
            disabled={pageIndex >= pages.length - 1}
          >
            <FaChevronRight />
          </button>
        </div>
        
        {pages.length > 1 && (
          <div className={styles.paginationDots}>
            {pages.map((_, idx) => (
              <button
                key={`${type}-dot-${idx}`}
                className={`${styles.paginationDot} ${pageIndex === idx ? styles.activeDot : ''}`}
                onClick={() => setPageIndex(idx)}
                aria-label={`Page ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal d'édition */}
      {editingCategory && (
        <CategoryModal 
          isVisible={!!editingCategory}
          onClose={closeEditModal}
          type={type}
          title="Modifier la catégorie"
          categoryName={editName}
          setName={setEditName}
          description={editDesc}
          setDescription={setEditDesc}
          onAdd={handleSaveEdit}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default CategorySection;