require 'rake/clean'

ENV["CLASSPATH"] = [
  "java/jruby-complete.jar",
  "/System/Library/Frameworks/JavaVM.framework/Versions/A/"\
    "Resources/Deploy.bundle/Contents/Resources/Java/plugin.jar"
].join(":")

SRC = FileList["java/src/**/*.java"]
BLD = FileList.new
EXTRA = FileList["java/extra/**/*"].delete_if { |f| File.directory?(f) }

EXTRA_DIR = "java/extra"
BUILD_DIR = "java/build"
GENERATED_JARS = FileList["java/*.jar"] - ["java/jruby-complete.jar"]

CLEAN.include BUILD_DIR
CLOBBER.include GENERATED_JARS

directory BUILD_DIR

SRC.each do |srcfile|
  classfile = srcfile.sub("/src/", "/build/").sub(/java$/, 'class')
  BLD << classfile
  
  file classfile => [srcfile, BUILD_DIR] do
    sh 'javac', '-d', BUILD_DIR, srcfile
  end
end

rule '.jar' => BLD do |t|
  cp 'java/jruby-complete.jar', t.name
  my_sh 'jar', '-uf', t.name, '-C', BUILD_DIR, '.'
  my_sh 'jar', '-uf', t.name, '-C', EXTRA_DIR, '.'
end

task :sign, :file do |t, args|
  sh 'jarsigner',
    '-keystore',   'java/keystore',
    '-storepass',  'camping',
    '-keypass',    'camping',
    args[:file],   # The file we're signing
    'camping'      # Alias (keyname)
end

desc 'Builds the JAR.'
task :build do
  require 'digest/sha1'
  sha = Digest::SHA1.new
  
  (SRC + EXTRA).each do |src|
    sha << File.read(src)
  end
  
  file = "java/#{sha.to_s[0,8]}.jar"
  Rake::Task[file].invoke
  Rake::Task["sign"].invoke(file)
  puts "** #{file} is ready!"
end

def my_sh(*args)
  puts args.join(" ")
  system *args
end
