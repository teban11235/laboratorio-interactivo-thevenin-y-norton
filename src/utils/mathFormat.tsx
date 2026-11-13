import React from 'react';

const MATH_TOKEN_REGEX =
  /([A-Za-z0-9]+)_([A-Za-z0-9]+)(?:\^(\([^)]+\)|[A-Za-z0-9]+))?|([A-Za-z0-9]+)\^(\([^)]+\)|[A-Za-z0-9]+)/g;

export function renderMathText(input: string): React.ReactNode {
  if (!input || (!input.includes('_') && !input.includes('^'))) {
    return input;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(MATH_TOKEN_REGEX.source, 'g');

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      parts.push(input.slice(lastIndex, match.index));
    }

    const [fullMatch, subBase, subVal, subSupVal, supOnlyBase, supOnlyVal] = match;
    const key = `${match.index}-${fullMatch}`;

    if (subBase !== undefined) {
      parts.push(
        <React.Fragment key={key}>
          {subBase}
          <sub className="text-[0.76em] leading-none bottom-[-0.2em] relative">{subVal}</sub>
          {subSupVal !== undefined && (
            <sup className="text-[0.72em] leading-none top-[-0.45em] relative ml-[0.5px]">
              {subSupVal}
            </sup>
          )}
        </React.Fragment>
      );
    } else if (supOnlyBase !== undefined) {
      parts.push(
        <React.Fragment key={key}>
          {supOnlyBase}
          <sup className="text-[0.72em] leading-none top-[-0.45em] relative ml-[0.5px]">
            {supOnlyVal}
          </sup>
        </React.Fragment>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < input.length) {
    parts.push(input.slice(lastIndex));
  }

  return parts;
}

export function renderSvgMathText(input: string): React.ReactNode {
  if (!input || (!input.includes('_') && !input.includes('^'))) {
    return input;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(MATH_TOKEN_REGEX.source, 'g');

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      parts.push(input.slice(lastIndex, match.index));
    }

    const [fullMatch, subBase, subVal, subSupVal, supOnlyBase, supOnlyVal] = match;
    const key = `svg-${match.index}-${fullMatch}`;

    if (subBase !== undefined) {
      parts.push(
        <React.Fragment key={key}>
          <tspan>{subBase}</tspan>
          <tspan baselineShift="sub" fontSize="75%">
            {subVal}
          </tspan>
          {subSupVal !== undefined && (
            <tspan baselineShift="super" fontSize="72%">
              {subSupVal}
            </tspan>
          )}
        </React.Fragment>
      );
    } else if (supOnlyBase !== undefined) {
      parts.push(
        <React.Fragment key={key}>
          <tspan>{supOnlyBase}</tspan>
          <tspan baselineShift="super" fontSize="72%">
            {supOnlyVal}
          </tspan>
        </React.Fragment>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < input.length) {
    parts.push(input.slice(lastIndex));
  }

  return parts;
}

