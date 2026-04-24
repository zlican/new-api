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
import { Input } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';

const SearchActions = memo(
  ({
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    searchValue = '',
    t,
  }) => {
    return (
      <div className='flex items-center gap-3 w-full'>
        <div className='flex-1'>
          <Input
            prefix={<IconSearch />}
            placeholder={t('模糊搜索模型名称')}
            value={searchValue}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onChange={handleChange}
            showClear
            size='large'
            className='pricing-model-search'
          />
        </div>
      </div>
    );
  },
);

SearchActions.displayName = 'SearchActions';

export default SearchActions;
