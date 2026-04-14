export interface ProductRepository {
    create(data: any): any;
    save(data: any): Promise<any>;
}