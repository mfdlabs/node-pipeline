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
	File Name: execution_plan.ts
	Description: A class that represents the execution plan of a pipeline.
	Written by: Nikita Petko
*/

import PipelineHandler from './pipeline_handler';
import ExecutionContext from './execution_context';

/**
 * A class that represents the execution plan of a pipeline.
 * @template TInput The input type of the pipeline.
 * @template TOutput The output type of the pipeline.
 */
export default class ExecutionPlan<TInput, TOutput = TInput> {
  private _handlers: PipelineHandler<TInput, TOutput>[];

  /**
   * Construct a new instance of the ExecutionPlan class.
   */
  public constructor() {
    this._handlers = [];
  }

  /**
   * Get the handlers of the pipeline.
   * @returns {PipelineHandler<TInput, TOutput>[]} The handlers of the pipeline.
   */
  public get handlers(): PipelineHandler<TInput, TOutput>[] {
    return this._handlers;
  }

  /**
   * Get the count of the handlers of the pipeline.
   * @returns {number} The count of the handlers of the pipeline.
   */
  public get handlerCount(): number {
    return this._handlers.length;
  }

  /**
   * Remove a handler at the specified index.
   * @param {number} index The index of the handler to remove.
   */
  public removeHandlerAt(index: number): void {
    if (index < 0 || index >= this._handlers.length) {
      throw new Error('Index does not exist in handlers.');
    }

    this._handlers.splice(index, 1);
  }

  /**
   * Remove the specified handler.
   * @param {PipelineHandler<TInput, TOutput>} handler The handler to remove.
   */
  public removeHandler(handler: PipelineHandler<TInput, TOutput>): void {
    const index = this._handlers.indexOf(handler);

    if (index === -1) {
      throw new Error('Handler does not exist in handlers.');
    }

    this._handlers.splice(index, 1);
  }

  /**
   * Append a handler to the pipeline.
   * @param {PipelineHandler<TInput, TOutput>} handler The handler to append.
   */
  public appendHandler(handler: PipelineHandler<TInput, TOutput>): void {
    if (handler === undefined || handler === null) {
      throw new Error('Handler cannot be null or undefined.');
    }

    this.insertHandlerAt(this._handlers.length, handler);
  }

  /**
   * Prepend a handler to the pipeline.
   * @param {PipelineHandler<TInput, TOutput>} handler The handler to prepend.
   */
  public prependHandler(handler: PipelineHandler<TInput, TOutput>): void {
    if (handler === undefined || handler === null) {
      throw new Error('Handler cannot be null or undefined.');
    }

    this.insertHandlerAt(0, handler);
  }

  /**
   * Add a handler after the specified handler.
   * @param {PipelineHandler<TInput, TOutput>} handler The handler to add after.
   * @param {PipelineHandler<TInput, TOutput>} newHandler The handler to add.
   */
  public addHandlerAfter(
    handler: PipelineHandler<TInput, TOutput>,
    newHandler: PipelineHandler<TInput, TOutput>,
  ): void {
    if (handler === undefined || handler === null) {
      throw new Error('Handler cannot be null or undefined.');
    }

    if (newHandler === undefined || newHandler === null) {
      throw new Error('New handler cannot be null or undefined.');
    }

    const index = this._handlers.indexOf(handler);

    if (index === -1) {
      throw new Error('Handler does not exist in handlers.');
    }

    this.insertHandlerAt(index + 1, newHandler);
  }

  /**
   * Add a handler before the specified handler.
   * @param {PipelineHandler<TInput, TOutput>} handler The handler to add before.
   * @param {PipelineHandler<TInput, TOutput>} newHandler The handler to add.
   */
  public addHandlerBefore(
    handler: PipelineHandler<TInput, TOutput>,
    newHandler: PipelineHandler<TInput, TOutput>,
  ): void {
    if (handler === undefined || handler === null) {
      throw new Error('Handler cannot be null or undefined.');
    }

    if (newHandler === undefined || newHandler === null) {
      throw new Error('New handler cannot be null or undefined.');
    }

    const index = this._handlers.indexOf(handler);

    if (index === -1) {
      throw new Error('Handler does not exist in handlers.');
    }

    this.insertHandlerAt(index, newHandler);
  }

  /**
   * Insert a handler at the specified index.
   * @param {number} index The index to insert the handler at.
   * @param {PipelineHandler<TInput, TOutput>} handler The handler to insert.
   */
  public insertHandlerAt(index: number, handler: PipelineHandler<TInput, TOutput>): void {
    if (index < 0 || index > this._handlers.length) {
      throw new Error('Index does not exist in handlers.');
    }

    if (handler === undefined || handler === null) {
      throw new Error('Handler cannot be null or undefined.');
    }

    // Throw if the specified handler is already in the pipeline.
    if (this._handlers.indexOf(handler) !== -1) {
      throw new Error(
        'handler is already part of the execution plan. The same instance may only be used in one execution plan once at a time.',
      );
    }

    if (index > 0) {
      this._handlers[index - 1].nextHandler = handler;
    }

    if (index < this._handlers.length) {
      handler.nextHandler = this._handlers[index + 1];
    }

    this._handlers.splice(index, 0, handler);
  }

  /**
   * Clear the handlers of the pipeline.
   */
  public clearHandlers(): void {
    this._handlers = [];
  }

  /**
   * Execute the pipeline.
   * @param {TInput} input The input to the pipeline.
   * @returns {TOutput} The output of the pipeline.
   * @throws {Error} If the pipeline is empty.
   */
  public execute(input: TInput): TOutput {
    if (this._handlers.length === 0) {
      throw new Error('Pipeline is empty.');
    }

    const context = new ExecutionContext<TInput, TOutput>(input);

    this._handlers[0].invoke(context);

    return context.output;
  }

  /**
   * Execute the pipeline asynchronously.
   * @param {TInput} input The input to the pipeline.
   * @returns {Promise<TOutput>} The output of the pipeline.
   * @throws {Error} If the pipeline is empty.
   */
  public async executeAsync(input: TInput): Promise<TOutput> {
    if (this._handlers.length === 0) {
      throw new Error('Pipeline is empty.');
    }

    const context = new ExecutionContext<TInput, TOutput>(input);

    await this._handlers[0].invokeAsync(context);

    return context.output;
  }
}
