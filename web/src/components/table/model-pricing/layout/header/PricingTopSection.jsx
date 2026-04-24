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

import React, { memo } from 'react';
import PricingVendorIntroWithSkeleton from './PricingVendorIntroWithSkeleton';
import SearchActions from './SearchActions';

const PricingTopSection = memo(
  ({
    isMobile,
    filterVendor,
    models,
    filteredModels,
    loading,
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    searchValue,
    t,
  }) => {
    if (isMobile) {
      return (
        <div className='w-full'>
          <SearchActions
            handleChange={handleChange}
            handleCompositionStart={handleCompositionStart}
            handleCompositionEnd={handleCompositionEnd}
            isMobile={isMobile}
            searchValue={searchValue}
            t={t}
          />
        </div>
      );
    }

    return (
      <PricingVendorIntroWithSkeleton
        loading={loading}
        filterVendor={filterVendor}
        models={filteredModels}
        allModels={models}
        t={t}
        handleChange={handleChange}
        handleCompositionStart={handleCompositionStart}
        handleCompositionEnd={handleCompositionEnd}
        isMobile={isMobile}
        searchValue={searchValue}
      />
    );
  },
);

PricingTopSection.displayName = 'PricingTopSection';

export default PricingTopSection;
