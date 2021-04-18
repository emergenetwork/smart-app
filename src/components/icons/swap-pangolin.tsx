import { svgIconFactory } from './icon-factory';

function Swap() {
  return (
    <svg
      width='1em'
      height='1em'
      viewBox='0 0 22 18'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <filter id='filter-1'>
          <feColorMatrix
            in='SourceGraphic'
            type='matrix'
            values='0 0 0 0 0.341176 0 0 0 0 0.270588 0 0 0 0 0.870588 0 0 0 1.000000 0'
          ></feColorMatrix>
        </filter>
        <linearGradient x1='100%' y1='80.8673469%' x2='0%' y2='19.1326531%' id='linearGradient-2'>
          <stop stopColor='#FE3876' offset='0%'></stop>
          <stop stopColor='#7C30DD' offset='71.4447846%'></stop>
          <stop stopColor='#3A30DD' offset='100%'></stop>
        </linearGradient>
      </defs>
      <g id='DVM' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
        <g id='其他网络' transform='translate(-216.000000, -304.000000)'>
          <g
            id='1.通用/2.Icon图标/Line/Change'
            transform='translate(215.000000, 301.000000)'
            filter='url(#filter-1)'
          >
            <g>
              <rect
                id='矩形'
                fill='#000000'
                fillRule='nonzero'
                opacity='0'
                x='0'
                y='0'
                width='24'
                height='24'
              ></rect>
              <path
                d='M7.23671378,6.6272442 L7.23671378,3.96189236 C7.23671378,3.96189236 7.24412555,3.82227875 6.97112612,3.76008715 C6.74383137,3.70931848 6.52642018,3.86670122 6.52642018,3.86670122 L1.9286465,7.19965528 C1.9286465,7.19965528 1.5,7.4255762 1.5,7.86853105 C1.5,8.30260264 1.80388239,8.47902416 1.80388239,8.47902416 L6.42881686,11.7244098 C6.42881686,11.7244098 6.7215816,11.8335623 6.97111164,11.7802552 C7.24040519,11.7218713 7.2379352,11.5200655 7.2379352,11.5200655 L7.2379352,9.02479344 L11.7344123,9.02479344 C11.7344123,9.02479344 15.2797008,9.51217206 15.2797008,10.8562709 C15.2797008,10.8562709 15.2216421,6.62723732 11.6207568,6.62723732 L7.23670473,6.62723732 L7.23671378,6.6272442 Z M16.7768829,17.3775028 L16.7768829,20.0441189 C16.7768829,20.0441189 16.8250594,20.2065784 17.1141182,20.2459241 C17.3068241,20.2713084 17.4278824,20.1710405 17.469883,20.1405793 L22.0701176,16.8038139 C22.0701176,16.8038139 22.5,16.5791628 22.5,16.1349381 C22.5,15.7008666 22.1948817,15.5231771 22.1948817,15.5231771 L17.5686987,12.2752629 C17.5686987,12.2752629 17.3759928,12.1559566 17.114111,12.2257635 C16.7904633,12.3120701 16.7768757,12.4796059 16.7768757,12.4796059 L16.7768757,14.9774251 L12.2569291,14.9774251 C12.2569291,14.9774251 8.70793115,14.4900464 8.70793115,13.1421399 C8.70793115,13.1421399 8.76722527,17.3749663 12.3718151,17.3749663 L16.7768757,17.3749663 L16.7768829,17.3775028 Z'
                id='形状'
                fill='url(#linearGradient-2)'
              ></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

export const SwapPangolinIcon = svgIconFactory(Swap);
