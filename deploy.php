<?php
namespace Deployer;

require 'recipe/common.php';

// Project name
set('application', 'pieterbot');

// Project repository
set('repository', 'git@gitlab.com:iolabsnl/pieterbot.git');

// [Optional] Allocate tty for git clone. Default value is false.
set('git_tty', true);

// Shared files/dirs between deploys
set('shared_files', ['.env']);
set('shared_dirs', ['public/images']);

// Writable dirs by web server
set('writable_dirs', []);
set('allow_anonymous_stats', false);

// Hosts

host('bot.iolabs.nl')
    ->set('deploy_path', '/var/www/pieterbot')
    ->user('root')
    ->port(22)
    ->configFile('~/.ssh/config')
    ->identityFile('~/.ssh/id_rsa')
    ->forwardAgent(true)
    ->multiplexing(true)
    ->addSshOption('UserKnownHostsFile', '/dev/null')
    ->addSshOption('StrictHostKeyChecking', 'no');
    

// Tasks

task('deploy:npm', 'npm install');

task('deploy:pm2', function () {
    run('cd {{ deploy_path }} && pm2 startOrReload ecosystem.config.js --update-env');
});

desc('Deploy your project');
task('deploy', [
    'deploy:info',
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
    'deploy:npm',
    'deploy:shared',
    'deploy:writable',
    'deploy:clear_paths',
    'deploy:symlink',
    'deploy:unlock',
    'deploy:pm2',
    'cleanup',
    'success'
]);

// [Optional] If deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');
