import {shallowMount} from '@vue/test-utils';
import RamMainView from '../RamMainView';

describe('RamMainView', () => {
  it('get props.dataUrl when passed, to fetch Data', () => {
    const dataUrl = 'https://mem.json';
    const wrapper = shallowMount(RamMainView, {
      propsData: {dataUrl: dataUrl},
    });
    expect(wrapper.props().dataUrl).toContain('https://');
  });
});
