
#
# Testing prav.js
#
# Mon Dec 29 10:59:39 JST 2025
#

group 'prav.js' do

  PRAV_TREES =
    File.read('test/_prav_trees.txt')
      .gsub(/\\\n/, '')
      .split("\n")
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

    PRAV_TREES.each do |code, tree|

      if tree == '∅'

        test ">#{code}< does not parse" do

          assert_nil @browser.eval("PravParser.parse(\"#{code}\")")
        end

      else

        test ">#{code}< parses" do

          assert @browser.eval("PravParser.parse(\"#{code}\")"), eval(tree)
        end
      end
    end
  end
end

