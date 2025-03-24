import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
  fill?: string;
  stroke?: string;
};

export interface Populate {
  path: string;
  select: string;
}
