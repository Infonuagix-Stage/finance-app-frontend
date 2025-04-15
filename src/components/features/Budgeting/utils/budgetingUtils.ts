/**
 * Découpe un tableau en morceaux de taille définie
 */
export function chunkArray<T>(arr: T[], size: number): T[][] {
    if (!arr || arr.length === 0) {
      return [[]];
    }
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }
  
  /**
   * Convertit une date en chaîne ISO locale (YYYY-MM-DD)
   */
  export function toLocalISODate(date: Date): string {
    const tzoffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzoffset).toISOString().split("T")[0];
  }
  
  /**
   * Formate un mois et une année (par exemple "Janvier 2023")
   */
  export function formatMonth(date: Date): string {
    return date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  }
  
  /**
   * Formate un montant avec 2 décimales
   */
  export function formatAmount(amount: number): string {
    return amount.toFixed(2);
  }
  
  /**
   * Capitalise la première lettre d'une chaîne
   */
  export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  /**
   * Calcule le total des montants pour une liste d'enregistrements
   */
  export function calculateTotal(records: any[]): number {
    return records.reduce((total, record) => total + (record.amount || 0), 0);
  }