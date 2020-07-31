export function sayHello() {
  return Math.random() < 0.5 ? "Hello" : "Hola";
}
class RequestStorage {
  currentReqId = 0;
  requestCache: Map<string, any> = new Map();
  abortableRequests: Map<number, AbortableRequest> = new Map<
    number,
    AbortableRequest
  >();
  getUniqueIdForReq(): number {
    this.currentReqId++;
    return this.currentReqId;
  }
  removeReq(id) {
    this.abortableRequests.delete(id);
  }
  addReq(id: number, req: AbortableRequest) {
    this.abortableRequests.set(id, req);
  }
  abortAllRequests() {
    this.abortableRequests.forEach((val, key) => {
      val.abort();
      this.abortableRequests.delete(key);
    });
  }
}
export const RequestStorageInstance = new RequestStorage();
export interface AbortableRequest {
  abort: Function;
  ready: Promise<any>;
}
export const createAbortableRequest = (
  request,
  options = {}
): AbortableRequest => {
  const reqId = RequestStorageInstance.getUniqueIdForReq();
  const controller = new AbortController();
  const { signal } = controller;
  const httpReq = fetch(request, { ...options, signal }).then((response) => {
    RequestStorageInstance.removeReq(req);
    return response;
  });
  const req = {
    abort: () => controller.abort(),
    ready: httpReq,
  };
  RequestStorageInstance.addReq(reqId, req);
  return req;
};
