/*
 * @Author: gyb
 * @Date: 2021-10-29
 * @Description: checkbox组件类型声明文件
 */

import type { IxPublicPropTypes } from '../../table/types';

export const checkboxProps = {
    checked: {
        type: Boolean,
        default: false
    },

    // 是否半选状态
    isHalf: {
        type: Boolean,
        default: false
    }
}

export type CheckboxPublicProps = Required<IxPublicPropTypes<typeof checkboxProps>>;