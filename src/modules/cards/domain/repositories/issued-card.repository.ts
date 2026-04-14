export interface IssuedCardRepository {
    create(data: any): any;
    save(data: any): Promise<any>;
    findByDocumentNumber(documentNumber: string): Promise<any>;
    updateStatus(cardId: number, status: string): Promise<void>;
}