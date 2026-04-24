/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React from 'react';
import PricingVendors from '../filter/PricingVendors';

import { usePricingFilterCounts } from '../../../../hooks/model-pricing/usePricingFilterCounts';

const PricingSidebar = ({
  filterGroup,
  filterQuotaType,
  filterEndpointType,
  filterVendor,
  setFilterVendor,
  filterTag,
  loading,
  t,
  ...categoryProps
}) => {
  const {
    vendorModels,
  } = usePricingFilterCounts({
    models: categoryProps.models,
    filterGroup,
    filterQuotaType,
    filterEndpointType,
    filterVendor,
    filterTag,
    searchValue: categoryProps.searchValue,
  });

  return (
    <div className='cyber-pricing-filterbar p-2'>
      <div className='cyber-pricing-filter-title flex items-center justify-between mb-6'>
        <div className='text-lg font-semibold text-gray-800'>{t('全部模型')}</div>
        <div className='text-xs text-gray-500'>{t('按模型厂商快速筛选')}</div>
      </div>

      <PricingVendors
        filterVendor={filterVendor}
        setFilterVendor={setFilterVendor}
        models={vendorModels}
        allModels={categoryProps.models}
        loading={loading}
        t={t}
      />

    </div>
  );
};

export default PricingSidebar;
