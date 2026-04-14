export interface CustomerRepository {
    findByDocument(documentNumber: string): Promise<any>;
    create(data: any): any;
    save(data: any): Promise<any>;
}