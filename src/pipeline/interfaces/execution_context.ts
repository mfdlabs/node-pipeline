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
	File Name: execution_context.ts
	Description: The interface that represents the execution context of a pipeline.
	Written by: Nikita Petko
*/

/* eslint-disable semi */

/**
 * The interface that represents the execution context of a pipeline.
 * @template TInput The input type of the pipeline.
 * @template TOutput The output type of the pipeline.
 */
export default interface IExecutionContext<TInput, TOutput = TInput> {
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
