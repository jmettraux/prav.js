
#
# Testing prav.js
#
# Mon Dec 29 10:59:39 JST 2025
#

group 'prav.js' do

  setup do

    @browser = make_browser
  end

  test 'sanity' do

    assert @browser.evaluate('1 + 1'), 2
  end

  group 'parsing' do

    test 'lookup failure' do

fail 'TODO'
    end
  end
end

