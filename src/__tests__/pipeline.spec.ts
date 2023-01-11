/*
   Copyright 2022 Nikita Petko <petko@vmminfra.net>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/*
	File Name: pipeline.spec.ts
	Description: Test suite for the pipeline module.
	Written by: Nikita Petko
*/

/* eslint-disable @typescript-eslint/no-explicit-any */

import ExecutionPlan from '../pipeline/execution_plan';
import PipelineHandler from '../pipeline/pipeline_handler';
import ExecutionContext from '../pipeline/execution_context';

describe('Pipeline', () => {
  describe('ExecutionContext', () => {
    describe('#constructor', () => {
      it('should construct a new instance of the ExecutionContext class', () => {
        const context = new ExecutionContext('test');
        expect(context).toBeInstanceOf(ExecutionContext);
      });
    });

    describe('#input', () => {
      it('should get the input of the pipeline', () => {
        const context = new ExecutionContext('test');
        expect(context.input).toBe('test');
      });
    });

    describe('#output', () => {
      it('should get the output of the pipeline', () => {
        const context = new ExecutionContext('test');
        expect(context.output).toBeUndefined();
      });

      it('should set the output of the pipeline', () => {
        const context = new ExecutionContext('test');
        context.output = 'test2';
        expect(context.output).toBe('test2');
      });
    });
  });

  describe('PipelineHandler', () => {
    describe('#constructor', () => {
      it('should construct a new instance of the PipelineHandler class', () => {
        const handler = new PipelineHandler();
        expect(handler).toBeInstanceOf(PipelineHandler);
      });
    });

    describe('#get_nextHandler', () => {
      it('should get the next pipeline handler', () => {
        const handler = new PipelineHandler(new PipelineHandler());

        expect(handler.nextHandler).toBeInstanceOf(PipelineHandler);
      });
    });

    describe('#set_nextHandler', () => {
      it('should set the next pipeline handler', () => {
        const handler = new PipelineHandler();
        const handler2 = new PipelineHandler();

        handler.nextHandler = handler2;

        expect(handler.nextHandler).toBe(handler2);
      });
    });

    describe('#invoke', () => {
      it('should invoke the pipeline handler', () => {
        class TestHandler extends PipelineHandler<string, string> {
          public invoke(context: ExecutionContext<string, string>): void {
            context.output = context.input;

            super.invoke(context);
          }
        }

        const handler = new TestHandler();
        const context = new ExecutionContext('test');

        handler.invoke(context);

        expect(context.output).toBe('test');
      });

      it('should throw if the context is undefined', () => {
        const handler = new PipelineHandler();

        expect(() => handler.invoke(undefined as any)).toThrow();
      });
    });

    describe('#invokeAsync', () => {
      it('should invoke the pipeline handler asynchronously', async () => {
        class TestHandler extends PipelineHandler<string, string> {
          public async invokeAsync(context: ExecutionContext<string, string>): Promise<void> {
            context.output = context.input;

            await super.invokeAsync(context);
          }
        }

        const handler = new TestHandler();
        const context = new ExecutionContext('test');

        await handler.invokeAsync(context);

        expect(context.output).toBe('test');
      });

      it('should throw if the context is undefined', async () => {
        const handler = new PipelineHandler();

        await expect(handler.invokeAsync(undefined as any)).rejects.toThrow();
      });
    });
  });

  describe('ExecutionPlan', () => {
    describe('#constructor', () => {
      it('should construct a new instance of the ExecutionPlan class', () => {
        const plan = new ExecutionPlan();
        expect(plan).toBeInstanceOf(ExecutionPlan);
      });
    });

    describe('#get_handlers', () => {
      it('should get the pipeline handlers', () => {
        const plan = new ExecutionPlan();
        expect(plan.handlers).toBeInstanceOf(Array);
      });
    });

    describe('#get_handlerCount', () => {
      it('should get the pipeline handler count', () => {
        const plan = new ExecutionPlan();
        expect(plan.handlerCount).toBe(0);
      });
    });

    describe('#removeHandlerAt', () => {
      it('should remove the pipeline handler at the specified index', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();

        plan.appendHandler(handler);
        plan.removeHandlerAt(0);

        expect(plan.handlerCount).toBe(0);
      });

      it('should throw if the index is out of range', () => {
        const plan = new ExecutionPlan();

        expect(() => plan.removeHandlerAt(0)).toThrow();
      });
    });

    describe('#removeHandler', () => {
      it('should remove the specified pipeline handler', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();

        plan.appendHandler(handler);
        plan.removeHandler(handler);

        expect(plan.handlerCount).toBe(0);
      });

      it('should throw if the handler is not found', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();

        expect(() => plan.removeHandler(handler)).toThrow();
      });
    });

    describe('#appendHandler', () => {
      it('should append the specified pipeline handler', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();

        plan.appendHandler(handler);

        expect(plan.handlerCount).toBe(1);
      });

      it('should throw if the handler is undefined or null', () => {
        const plan = new ExecutionPlan();

        expect(() => plan.appendHandler(undefined as any)).toThrow();
        expect(() => plan.appendHandler(null as any)).toThrow();
      });
    });

    describe('#prependHandler', () => {
      it('should prepend the specified pipeline handler', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();

        plan.prependHandler(handler);

        expect(plan.handlerCount).toBe(1);
      });

      it('should throw if the handler is undefined or null', () => {
        const plan = new ExecutionPlan();

        expect(() => plan.prependHandler(undefined as any)).toThrow();
        expect(() => plan.prependHandler(null as any)).toThrow();
      });
    });

    describe('#addHandlerAfter', () => {
      it('should add the specified pipeline handler after the specified handler', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();
        const handler2 = new PipelineHandler();

        plan.appendHandler(handler);
        plan.addHandlerAfter(handler, handler2);

        expect(plan.handlerCount).toBe(2);
      });

      it('should throw if the handler is undefined or null', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();

        expect(() => plan.addHandlerAfter(handler, undefined as any)).toThrow();
        expect(() => plan.addHandlerAfter(handler, null as any)).toThrow();
      });

      it('should throw if the new handler is undefined or null', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();

        expect(() => plan.addHandlerAfter(undefined as any, handler)).toThrow();
        expect(() => plan.addHandlerAfter(null as any, handler)).toThrow();
      });

      it('should throw if the handler is not found', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();
        const handler2 = new PipelineHandler();

        expect(() => plan.addHandlerAfter(handler, handler2)).toThrow();
      });
    });

    describe('#addHandlerBefore', () => {
      it('should add the specified pipeline handler before the specified handler', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();
        const handler2 = new PipelineHandler();

        plan.appendHandler(handler);
        plan.addHandlerBefore(handler, handler2);

        expect(plan.handlerCount).toBe(2);
      });

      it('should throw if the handler is undefined or null', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();

        expect(() => plan.addHandlerBefore(handler, undefined as any)).toThrow();
        expect(() => plan.addHandlerBefore(handler, null as any)).toThrow();
      });

      it('should throw if the new handler is undefined or null', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();

        expect(() => plan.addHandlerBefore(undefined as any, handler)).toThrow();
        expect(() => plan.addHandlerBefore(null as any, handler)).toThrow();
      });

      it('should throw if the handler is not found', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();
        const handler2 = new PipelineHandler();

        expect(() => plan.addHandlerBefore(handler, handler2)).toThrow();
      });
    });

    describe('#insertHandlerAt', () => {
      it('should insert the specified pipeline handler at the specified index', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();
        const handler2 = new PipelineHandler();

        plan.appendHandler(handler);
        plan.insertHandlerAt(0, handler2);

        expect(plan.handlerCount).toBe(2);
      });

      it('should throw if the index is out of range', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();

        expect(() => plan.insertHandlerAt(1, handler)).toThrow();
      });

      it('should throw if the handler is undefined or null', () => {
        const plan = new ExecutionPlan();

        expect(() => plan.insertHandlerAt(0, undefined as any)).toThrow();
        expect(() => plan.insertHandlerAt(0, null as any)).toThrow();
      });

      it('should throw if the handler at the specified index is the same as the new handler', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();

        plan.appendHandler(handler);

        expect(() => plan.insertHandlerAt(0, handler)).toThrow();
      });

      it('should set the next handler of the previous handler to the new handler', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();
        const handler2 = new PipelineHandler();
        const handler3 = new PipelineHandler();

        plan.appendHandler(handler);
        plan.appendHandler(handler2);
        plan.insertHandlerAt(1, handler3);

        expect(handler.nextHandler).toBe(handler3);
      });

      it('should set the next handler of the current handler to the handler at the next index if it is not the last handler', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();
        const handler2 = new PipelineHandler();
        const handler3 = new PipelineHandler();

        plan.appendHandler(handler);
        plan.appendHandler(handler2);
        plan.insertHandlerAt(0, handler3);

        expect(handler3.nextHandler).toBe(handler2);
      });
    });

    describe('#clearHandlers', () => {
      it('should clear all handlers', () => {
        const plan = new ExecutionPlan();
        const handler = new PipelineHandler();

        plan.appendHandler(handler);
        plan.clearHandlers();

        expect(plan.handlerCount).toBe(0);
      });
    });

    describe('#execute', () => {
      it('should execute the pipeline', async () => {
        class TestHandler extends PipelineHandler<string, string> {
          public invoke(context: ExecutionContext<string, string>): void {
            context.output = context.input + '!';

            super.invoke(context);
          }
        }

        class TestHandler2 extends PipelineHandler<string, string> {
          public invoke(context: ExecutionContext<string, string>): void {
            context.output = context.input + '?';

            super.invoke(context);
          }
        }

        const plan = new ExecutionPlan<string, string>();
        const handler = new TestHandler();
        const handler2 = new TestHandler2();

        plan.appendHandler(handler);
        plan.appendHandler(handler2);

        // Track the .invoke() call to ensure it is called.
        const invokeSpy = jest.spyOn(handler, 'invoke');
        const invokeSpy2 = jest.spyOn(handler2, 'invoke');

        const result = plan.execute('Hello');

        expect(result).toBe('Hello?');
        expect(invokeSpy).toHaveBeenCalled();
        expect(invokeSpy2).toHaveBeenCalled();
      });

      it('should throw if there are no handlers', () => {
        const plan = new ExecutionPlan();

        expect(() => plan.execute('Hello')).toThrow();
      });
    });

    describe('#executeAsync', () => {
      it('should execute the pipeline', async () => {
        class TestHandler extends PipelineHandler<string, string> {
          public async invokeAsync(context: ExecutionContext<string, string>): Promise<void> {
            context.output = context.input + '!';

            await super.invokeAsync(context);
          }
        }

        class TestHandler2 extends PipelineHandler<string, string> {
          public async invokeAsync(context: ExecutionContext<string, string>): Promise<void> {
            context.output = context.input + '?';

            await super.invokeAsync(context);
          }
        }

        const plan = new ExecutionPlan<string, string>();
        const handler = new TestHandler();
        const handler2 = new TestHandler2();

        plan.appendHandler(handler);
        plan.appendHandler(handler2);

        // Track the .invoke() call to ensure it is called.
        const invokeSpy = jest.spyOn(handler, 'invokeAsync');
        const invokeSpy2 = jest.spyOn(handler2, 'invokeAsync');

        const result = await plan.executeAsync('Hello');

        expect(result).toBe('Hello?');
        expect(invokeSpy).toHaveBeenCalled();
        expect(invokeSpy2).toHaveBeenCalled();
      });

      it('should throw if there are no handlers', async () => {
        const plan = new ExecutionPlan();

        expect(plan.executeAsync('Hello')).rejects.toThrow();
      });
    });
  });
});
