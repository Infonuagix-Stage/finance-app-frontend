import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PaymentCard, { DebtItem, ProjectItem } from "./PaymentCard";
import styles from "./PaymentSection.module.css";

type PaymentItem = DebtItem | ProjectItem;

interface PaymentSectionProps {
  title: string;
  itemType: "DEBT" | "PROJECT";
  pages: PaymentItem[][];
  pageIndex: number;
  prevPage: () => void;
  nextPage: () => void;
  setPageIndex: (index: number) => void;
  onAddClick?: () => void; // Maintenant optionnel car nous utiliserons aussi la navigation directe
  currentDate: Date;
  onEditItem: (item: PaymentItem) => void;
  onDeleteItem: (itemId: string) => Promise<void>;
  totalMonthly?: number;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  title,
  itemType,
  pages,
  pageIndex,
  prevPage,
  nextPage,
  setPageIndex,
  onAddClick,
  currentDate,
  onEditItem,
  onDeleteItem,
  totalMonthly = 0,
}) => {
  const navigate = useNavigate();
  const isDebtSection = itemType === "DEBT";
  const titleColor = isDebtSection ? styles.debtTitle : styles.projectTitle;

  // Fonction de navigation pour rediriger vers les routes appropriées
  const handleNavigation = () => {
    if (isDebtSection) {
      navigate('/payment');
    } else {
      navigate('/project');
    }
  };

  // Si aucune page ou tableau vide, afficher seulement le bouton d'ajout
  if (!pages || pages.length === 0 || (pages.length === 1 && pages[0].length === 0)) {
    return (
      <div>
        <div className={styles.sectionHeader}>
          <h2 className={`${styles.categoryTitle} ${titleColor}`}>{title}</h2>
          {totalMonthly > 0 && (
            <div className={styles.sectionMonthlySummary}>
              <span className={styles.monthlyLabel}>
                {isDebtSection ? "Paiements mensuels:" : "Contributions mensuelles:"}
              </span>
              <span className={styles.monthlyAmount}>${totalMonthly.toFixed(2)}</span>
            </div>
          )}
        </div>
        <div className={styles.emptySection}>
          <p>Aucun {isDebtSection ? "dette" : "projet"} à afficher.</p>
          <button 
            onClick={handleNavigation} 
            className={styles.emptyAddButton}
          >
            Ajouter {isDebtSection ? "une dette" : "un projet"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h2 className={`${styles.categoryTitle} ${titleColor}`}>{title}</h2>
        {totalMonthly > 0 && (
          <div className={styles.sectionMonthlySummary}>
            <span className={styles.monthlyLabel}>
              {isDebtSection ? "Paiements mensuels:" : "Contributions mensuelles:"}
            </span>
            <span className={styles.monthlyAmount}>${totalMonthly.toFixed(2)}</span>
          </div>
        )}
      </div>
      
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
                <div key={`${itemType}-page-${pageIdx}`} className={styles.carouselPage}>
                  {page.map((item) => (
                    <PaymentCard 
                      key={isDebtSection ? (item as DebtItem).debtId : (item as ProjectItem).projectId}
                      item={item}
                      itemType={itemType}
                      currentDate={currentDate}
                      onEditClick={onEditItem}
                      onDeleteClick={onDeleteItem}
                    />
                  ))}
                  
                  {/* Ajout du bouton "+" uniquement à la dernière page */}
                  {pageIdx === pages.length - 1 && (
                    <button
                      onClick={handleNavigation}
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
                key={`${itemType}-dot-${idx}`}
                className={`${styles.paginationDot} ${pageIndex === idx ? styles.activeDot : ''}`}
                onClick={() => setPageIndex(idx)}
                aria-label={`Page ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSection;