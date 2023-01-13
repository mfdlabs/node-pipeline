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
	File Name: pipeline_handler.ts
	Description: The interface that represents a pipeline handler.
	Written by: Nikita Petko
*/

/* eslint-disable semi */

import IExecutionContext from './execution_context';

/**
 * The interface that represents a pipeline handler.
 * @template TInput The input type of the pipeline.
 * @template TOutput The output type of the pipeline.
 */
export default interface IPipelineHandler<TInput, TOutput = TInput> {
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
