export default interface IDataGateway {
    get(path: string): Promise<object>;
    post(path: string, requestDto: object): Promise<object>;
    delete(path: string): Promise<object>;
}