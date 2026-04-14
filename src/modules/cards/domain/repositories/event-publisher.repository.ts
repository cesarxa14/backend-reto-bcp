export interface EventPublisher {
    publish(topic: string, payload: any): Promise<any>;
}