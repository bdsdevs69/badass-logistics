/* ===========================================================
   Badass Logistics — US state table (single source of truth)

   Name and principal Interstates per state, for the metros we cover.
   Lived inside build-service-cities.js until 2026-09-22; lib/guardrails.js
   needs the same table to check that generated city pages actually carry
   their own local detail, and two copies of a table like this drift.
   =========================================================== */
const STATE = {
  CA:{name:'California',ix:'I-5, I-10, I-15 and I-80'}, OR:{name:'Oregon',ix:'I-5 and I-84'}, WA:{name:'Washington',ix:'I-5, I-90 and I-82'}, NV:{name:'Nevada',ix:'I-15 and I-80'},
  AZ:{name:'Arizona',ix:'I-10, I-17 and I-40'}, NM:{name:'New Mexico',ix:'I-25, I-40 and I-10'}, CO:{name:'Colorado',ix:'I-25, I-70 and I-76'}, UT:{name:'Utah',ix:'I-15, I-80 and I-70'},
  ID:{name:'Idaho',ix:'I-84, I-86 and I-15'}, MT:{name:'Montana',ix:'I-90, I-94 and I-15'}, WY:{name:'Wyoming',ix:'I-25, I-80 and I-90'}, ND:{name:'North Dakota',ix:'I-29 and I-94'},
  NE:{name:'Nebraska',ix:'I-80 and I-29'}, MN:{name:'Minnesota',ix:'I-35, I-90 and I-94'}, MO:{name:'Missouri',ix:'I-70, I-44, I-35 and I-29'}, WI:{name:'Wisconsin',ix:'I-94, I-43 and I-90'},
  IL:{name:'Illinois',ix:'I-55, I-80, I-90 and I-94'}, IN:{name:'Indiana',ix:'I-65, I-70 and I-69'}, MI:{name:'Michigan',ix:'I-75, I-94 and I-96'}, OH:{name:'Ohio',ix:'I-70, I-71, I-75 and I-90'},
  TX:{name:'Texas',ix:'I-10, I-20, I-35 and I-45'}, OK:{name:'Oklahoma',ix:'I-35, I-40 and I-44'}, AR:{name:'Arkansas',ix:'I-40, I-30 and I-55'}, LA:{name:'Louisiana',ix:'I-10, I-12, I-20 and I-49'},
  MS:{name:'Mississippi',ix:'I-55, I-20, I-10 and I-59'}, AL:{name:'Alabama',ix:'I-65, I-20, I-10 and I-59'}, TN:{name:'Tennessee',ix:'I-40, I-65, I-24 and I-75'}, GA:{name:'Georgia',ix:'I-75, I-85, I-20 and I-95'},
  SC:{name:'South Carolina',ix:'I-95, I-26, I-85 and I-20'}, NC:{name:'North Carolina',ix:'I-40, I-85, I-95 and I-77'}, FL:{name:'Florida',ix:'I-95, I-75, I-10 and I-4'}, KY:{name:'Kentucky',ix:'I-65, I-64, I-75 and I-71'},
  VA:{name:'Virginia',ix:'I-95, I-64, I-81 and I-66'}, MD:{name:'Maryland',ix:'I-95, I-70 and I-83'}, PA:{name:'Pennsylvania',ix:'I-76, I-80, I-81 and I-95'}, NY:{name:'New York',ix:'I-87, I-90, I-95 and I-81'}, MA:{name:'Massachusetts',ix:'I-90, I-95 and I-93'},
  KS:{name:'Kansas',ix:'I-70, I-35 and I-135'}, CT:{name:'Connecticut',ix:'I-95, I-91 and I-84'}, IA:{name:'Iowa',ix:'I-80, I-35 and I-380'},
};

const stateName = (st) => (STATE[st] && STATE[st].name) || st;
const interstatesOf = (st) => (STATE[st] && STATE[st].ix) || 'the Interstate system';
const STATE_NAMES = Object.fromEntries(Object.entries(STATE).map(([k, v]) => [k, v.name]));

module.exports = { STATE, STATE_NAMES, stateName, interstatesOf };
