import * as util from './util';
export { cache, Component, instance, next, Service } from './core';

export namespace events {
    namespace dom {
        function update(): void;
    }
}

export { util };
