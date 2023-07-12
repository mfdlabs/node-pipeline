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
	Description: The interface that represents a pipeline execution plan.
	Written by: Nikita Petko
*/

/* eslint-disable semi */

import IPipelineHandler from './pipeline_handler';

/**
 * The interface that represents a pipeline execution plan.
 * @template TInput The input type of the pipeline.
 * @template TOutput The output type of the pipeline.
 */
export default interface IExecutionPlan<TInput, TOutput = TInput> {
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
   * @template THandler The type of the handler to add after.
   * @param {THandler} handler The handler to add after.
   * @param {IPipelineHandler<TInput, TOutput>} newHandler The handler to add.
   */
  addHandlerAfter<THandler extends string>(handler: THandler, newHandler: IPipelineHandler<TInput, TOutput>): void;

  /**
   * Add a handler before the specified handler.
   * @template THandler The type of the handler to add before.
   * @param {THandler} handler The handler to add before.
   * @param {IPipelineHandler<TInput, TOutput>} newHandler The handler to add.
   */
  addHandlerBefore<THandler extends string>(handler: THandler, newHandler: IPipelineHandler<TInput, TOutput>): void;

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
