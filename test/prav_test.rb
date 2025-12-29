
#
# Testing prav.js
#
# Mon Dec 29 10:59:39 JST 2025
#

group 'prav.js' do

  PRAV_TREES =
    File.readlines('test/_prav_trees.txt')
      .map(&:strip)
      .map { |l| m = l.match(/^(.*)(#.*)$/); m ? m[1].strip : l }
      .select { |l| l.length > 0 && l[0, 1] != '#' }
      .map { |l| l.split(/\s*⟶\s*/) }

  setup do

    @browser = make_browser
  end

  test 'sanity' do

    assert @browser.evaluate('1 + 1'), 2
  end

  group 'parsing' do

    test 'lookup failure' do

      PRAV_TREES.each do |code, tree|

        t = @browser.eval("PravParser.parse(\"#{code}\")")
        p [ code, tree, t ]
      end
    end
  end
end

