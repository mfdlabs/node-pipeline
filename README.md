# @mfdlabs/pipeline

This is a Node.js package that implements [@fx-dev/pipeline](https://github.vmminfra.dev/fx-dev/pipeline).

# Examples

```typescript
import { PipelineHandler, ExecutionPlan, IExecutionContext } from '@mfdlabs/pipeline';

class MyPipelineHandler extends PipelineHandler<string, string> {
  public override execute(context: IExecutionContext<string, string>): void {
    context.output = 'Hello World!';

    super.execute(context);
  }

  public override async executeAsync(context: IExecutionContext<string, string>): Promise<void> {
    context.output = 'Hello World!';

    await super.executeAsync(context);
  }
}

const handler = new MyPipelineHandler();
const plan = new ExecutionPlan<string, string>();

plan.appendHandler(handler);

console.log(plan.execute('What did you say?')); // Hello World!
console.log(await plan.executeAsync('What did you say?')); // Hello World!
```

# Exports

The package exports the following:

```typescript
/**
 * A class that represents a pipeline handler.
 * @template TInput The input type of the pipeline.
 * @template TOutput The output type of the pipeline.
 */
export class PipelineHandler<TInput, TOutput = TInput> implements IPipelineHandler<TInput, TOutput> {
  /**
   * Construct a new instance of the PipelineHandler class.
   * @param {IPipelineHandler<TInput, TOutput>?} next The next pipeline handler.
   */
  constructor(next?: IPipelineHandler<TInput, TOutput>);

  /**
   * Get the next pipeline handler.
   * @returns {PipelineHandler<TInput, TOutput>} The next pipeline handler.
   */
  get nextHandler(): IPipelineHandler<TInput, TOutput> | undefined;

  /**
   * Set the next pipeline handler.
   * @param {IPipelineHandler<TInput, TOutput>?} next The next pipeline handler.
   */
  set nextHandler(next: IPipelineHandler<TInput, TOutput>);

  /**
   * Invoke the pipeline handler.
   * @param {IExecutionContext<TInput, TOutput>} context The execution context of the pipeline.
   */
  invoke(context: IExecutionContext<TInput, TOutput>): void;

  /**
   * Invoke the pipeline handler asynchronously.
   * @param {IExecutionContext<TInput, TOutput>} context The execution context of the pipeline.
   * @returns {Promise<void>} A promise that represents the asynchronous operation.
   */
  invokeAsync(context: IExecutionContext<TInput, TOutput>): Promise<void>;
}

/**
 * A class that represents the execution context of a pipeline.
 * @template TInput The input type of the pipeline.
 * @template TOutput The output type of the pipeline.
 */
export class ExecutionContext<TInput, TOutput = TInput> implements IExecutionContext<TInput, TOutput> {
  /**
   * Construct a new instance of the ExecutionContext class.
   * @param {TInput} input The input of the pipeline.
   */
  constructor(input: TInput);

  /**
   * Get the input of the pipeline.
   * @returns {TInput} The input of the pipeline.
   */
  get input(): TInput;

  /**
   * Get the output of the pipeline.
   * @returns {TOutput} The output of the pipeline.
   */
  get output(): TOutput;

  /**
   * Set the output of the pipeline.
   * @param {TOutput} output The output of the pipeline.
   */
  set output(output: TOutput);
}

/**
 * A class that represents the execution plan of a pipeline.
 * @template TInput The input type of the pipeline.
 * @template TOutput The output type of the pipeline.
 */
export class ExecutionPlan<TInput, TOutput = TInput> implements IExecutionPlan<TInput, TOutput> {
  /**
   * Construct a new instance of the ExecutionPlan class.
   */
  constructor();

  /**
   * Get the handlers of the pipeline.
   * @returns {IPipelineHandler<TInput, TOutput>[]} The handlers of the pipeline.
   */
  get handlers(): IPipelineHandler<TInput, TOutput>[];

  /**
   * Get the count of the handlers of the pipeline.
   * @returns {number} The count of the handlers of the pipeline.
   */
  get handlerCount(): number;

  /**
   * Remove a handler at the specified index.
   * @param {number} index The index of the handler to remove.
   */
  removeHandlerAt(index: number): void;

  /**
   * Remove the specified handler.
   * @param {IPipelineHandler<TInput, TOutput>} handler The handler to remove.
   */
  removeHandler(handler: IPipelineHandler<TInput, TOutput>): void;

  /**
   * Append a handler to the pipeline.
   * @param {IPipelineHandler<TInput, TOutput>} handler The handler to append.
   */
  appendHandler(handler: IPipelineHandler<TInput, TOutput>): void;

  /**
   * Prepend a handler to the pipeline.
   * @param {IPipelineHandler<TInput, TOutput>} handler The handler to prepend.
   */
  prependHandler(handler: IPipelineHandler<TInput, TOutput>): void;

  /**
   * Add a handler after the specified handler.
   * @param {IPipelineHandler<TInput, TOutput>} handler The handler to add after.
   * @param {IPipelineHandler<TInput, TOutput>} newHandler The handler to add.
   */
  addHandlerAfter(handler: IPipelineHandler<TInput, TOutput>, newHandler: IPipelineHandler<TInput, TOutput>): void;

  /**
   * Add a handler before the specified handler.
   * @param {IPipelineHandler<TInput, TOutput>} handler The handler to add before.
   * @param {IPipelineHandler<TInput, TOutput>} newHandler The handler to add.
   */
  addHandlerBefore(handler: IPipelineHandler<TInput, TOutput>, newHandler: IPipelineHandler<TInput, TOutput>): void;

  /**
   * Insert a handler at the specified index.
   * @param {number} index The index to insert the handler at.
   * @param {IPipelineHandler<TInput, TOutput>} handler The handler to insert.
   */
  insertHandlerAt(index: number, handler: IPipelineHandler<TInput, TOutput>): void;

  /**
   * Clear the handlers of the pipeline.
   */
  clearHandlers(): void;

  /**
   * Execute the pipeline.
   * @param {TInput} input The input to the pipeline.
   * @returns {TOutput} The output of the pipeline.
   * @throws {Error} If the pipeline is empty.
   */
  execute(input: TInput): TOutput;

  /**
   * Execute the pipeline asynchronously.
   * @param {TInput} input The input to the pipeline.
   * @returns {Promise<TOutput>} The output of the pipeline.
   * @throws {Error} If the pipeline is empty.
   */
  executeAsync(input: TInput): Promise<TOutput>;
}

/**
 * The interface that represents a pipeline execution plan.
 * @template TInput The input type of the pipeline.
 * @template TOutput The output type of the pipeline.
 */
export interface IExecutionPlan<TInput, TOutput = TInput> {
  /**
   * Get the pipeline handlers.
   * @returns {IPipelineHandler<TInput, TOutput>[]} The pipeline handlers.
   */
  get handlers(): IPipelineHandler<TInput, TOutput>[];

  /**
   * Get the count of the pipeline handlers.
   * @returns {number} The count of the pipeline handlers.
   */
  get handlerCount(): number;

  /**
   * Remove a handler at the specified index.
   * @param {number} index The index of the handler to remove.
   */
  removeHandlerAt(index: number): void;

  /**
   * Remove the specified handler.
   * @param {IPipelineHandler<TInput, TOutput>} handler The handler to remove.
   */
  removeHandler(handler: IPipelineHandler<TInput, TOutput>): void;

  /**
   * Append a handler to the end of the pipeline.
   * @param {IPipelineHandler<TInput, TOutput>} handler The handler to append.
   */
  appendHandler(handler: IPipelineHandler<TInput, TOutput>): void;

  /**
   * Prepend a handler to the start of the pipeline.
   * @param {IPipelineHandler<TInput, TOutput>} handler The handler to prepend.
   */
  prependHandler(handler: IPipelineHandler<TInput, TOutput>): void;

  /**
   * Add a handler after the specified handler.
   * @param {IPipelineHandler<TInput, TOutput>} handler The handler to add after.
   * @param {IPipelineHandler<TInput, TOutput>} newHandler The handler to add.
   */
  addHandlerAfter(handler: IPipelineHandler<TInput, TOutput>, newHandler: IPipelineHandler<TInput, TOutput>): void;

  /**
   * Add a handler before the specified handler.
   * @param {IPipelineHandler<TInput, TOutput>} handler The handler to add before.
   * @param {IPipelineHandler<TInput, TOutput>} newHandler The handler to add.
   */
  addHandlerBefore(handler: IPipelineHandler<TInput, TOutput>, newHandler: IPipelineHandler<TInput, TOutput>): void;

  /**
   * Insert a handler at the specified index.
   * @param {number} index The index to insert the handler at.
   * @param {IPipelineHandler<TInput, TOutput>} handler The handler to insert.
   */
  insertHandlerAt(index: number, handler: IPipelineHandler<TInput, TOutput>): void;

  /**
   * Clear the handlers of the pipeline.
   */
  clearHandlers(): void;

  /**
   * Execute the pipeline.
   * @param {TInput} input The input of the pipeline.
   * @returns {TOutput} The output of the pipeline.
   */
  execute(input: TInput): TOutput;

  /**
   * Execute the pipeline asynchronously.
   * @param {TInput} input The input of the pipeline.
   * @returns {Promise<TOutput>} The output of the pipeline.
   */
  executeAsync(input: TInput): Promise<TOutput>;
}

/**
 * The interface that represents a pipeline handler.
 * @template TInput The input type of the pipeline.
 * @template TOutput The output type of the pipeline.
 */
export interface IPipelineHandler<TInput, TOutput = TInput> {
  /**
   * The next handler in the pipeline.
   * @returns {IPipelineHandler<TInput, TOutput>} The next handler in the pipeline.
   */
  get nextHandler(): IPipelineHandler<TInput, TOutput>;

  /**
   * Set the next handler in the pipeline.
   * @param {IPipelineHandler<TInput, TOutput>} next The next handler in the pipeline.
   */
  set nextHandler(next: IPipelineHandler<TInput, TOutput>);

  /**
   * Invoke the pipeline handler.
   * @param {IExecutionContext<TInput, TOutput>} context The execution context of the pipeline.
   * @returns {void}
   */
  invoke(context: IExecutionContext<TInput, TOutput>): void;

  /**
   * Invoke the pipeline handler asynchronously.
   * @param {IExecutionContext<TInput, TOutput>} context The execution context of the pipeline.
   * @returns {Promise<void>} A promise that resolves when the pipeline handler is invoked.
   */
  invokeAsync(context: IExecutionContext<TInput, TOutput>): Promise<void>;
}

/**
 * The interface that represents the execution context of a pipeline.
 * @template TInput The input type of the pipeline.
 * @template TOutput The output type of the pipeline.
 */
export interface IExecutionContext<TInput, TOutput = TInput> {
  /**
   * Get the input of the pipeline.
   * @returns {TInput} The input of the pipeline.
   * @readonly
   */
  get input(): TInput;

  /**
   * Get the output of the pipeline.
   * @returns {TOutput} The output of the pipeline.
   */
  get output(): TOutput;

  /**
   * Set the output of the pipeline.
   * @param {TOutput} output The output of the pipeline.
   */
  set output(output: TOutput);
}
```
